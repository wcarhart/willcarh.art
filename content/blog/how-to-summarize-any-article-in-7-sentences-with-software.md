### Everything comes from Reddit
Have you ever been on Reddit and seen the [autotldr bot](https://www.reddit.com/r/autotldr/)? The autotldr bot's purpose is to summarize text articles on Reddit so users don't have to open the article and read it themselves (insert joke about people only reading headlines). This is a really nice feature, as many news sites are littered with popups, paywalls, and trackers, and some don't load well on mobile devices.
Well, I was on Reddit one day and in the thread I was reading the most upvoted comment was the autotldr bot giving a summary about an article. I clicked on the article and found that autotldr's summary was accurate. Not only that, but the article was long and complicated. It had stock tickers and company names, but autotldr summarized in 7 sentences. How could it have done that?

### SMMRY explained
The autotldr bot is built off of [SMMRY](https://smmry.com/), and algorithm that summarizes any text article into 7 sentences. This may seem like black magic, but SMMRY is nice enough to share their pseudocode on their webpage. Here are the steps:
1. Associate words with their grammatical counterparts. (e.g. "city" and "cities")
2. Calculate the occurrence of each word in the text.
3. Assign each word with points depending on their popularity.
4. Detect which periods represent the end of a sentence. (e.g "Mr." does not).
5. Split up the text into individual sentences.
6. Rank sentences by the sum of their words' points.
7. Return X of the most highly ranked sentences in chronological order.

### Recreating it ourselves
Given that we can almost take this pseudocode and put a `.py` extension on it and be done, this seems pretty easy to replicate in Python.
Let's assume we have a single chunk of text in a string. We'll need a smart way to split up the text into sentences. We know that there are only a few characters that can end sentences, like `.`, `?`, and `!`. We'll just need to be careful of abbreviations (e.g. `Mrs.`, `Dr.`) and extensions (e.g. `.js`, `.pptx`).
```python
import re

def get_sentences(text):
    # attempt to split sentences on .?!
    sentences = [chunk for chunk in re.split('([.?!])', text) if not chunk == '' and not chunk.isspace()]
    sentences = [x+y for x,y in zip(sentences[0::2], sentences[1::2])]

    # let's assume that we have a list of known abbreviations in a list called ABB
    # and a list of known extensions in a list call EXT
    # we'll need to join our sentences together if they were split on an abbreviation or extension
    index = 0
    while index < len(sentences) - 2:
        last_word_previous_sentence = ''.join(character for character in sentences[index].split()[-1].lower() if character.isalnum()).lower()
        first_word_next_sentence = ''.join(character for character in sentences[index+1].split()[0].lower() if character.isalnum()).lower()
        if (
            last_word_previous_sentence in ABB
            or first_word_next_sentence in EXT
            or len(last_word_previous_sentence) == 1
            or len(first_word_next_sentence) == 1
        ) and (
            not last_word_previous_sentence in ['a', 'i']
            and not first_word_next_sentence in ['a', 'i']
        ):
            sentences[index] = ''.join([sentences[index], sentences[index + 1]])
            del sentences[index + 1]
        else:
            index += 1
    return [sentence.strip() for sentence in sentences]
```
Next, we'll need to determine how often each word occurs, or its frequency. We only want to count _meaningful_ words, so not words like _the_, _a_, _an_, etc. Let's assume we have a list of known words to exclude in a list called `EXCLUDE`.
```python
def calculate_word_frequency(sentences):
    frequencies = {}
    words = ' '.join(sentences).split()
    raw_words = [''.join(character for character in word if character.isalnum()).lower() for word in words]
    for word in raw_words:
        if word in EXCLUDE:
            frequencies[word] = 0
        elif word in frequencies:
            frequencies[word] += 1
        else:
            frequencies[word] = 1

    if '' in frequencies:
        del frequencies['']
    return frequencies
```
Now that we have the frequency of each word, we'll need to score each sentence based on the words it contains. For instance, if we had the frequencies `{'the': 0, 'cake': 2, 'is': 0, 'a': 0, 'lie': 5}` and the sentence `the cake is a lie`, then the sentence's score would be `7`.
```python
def calculate_sentence_scores(sentences, frequencies):
    scores = []
    for sentence in sentences:
        score = 0
        for word in sentence.split():
            raw_word = ''.join(character for character in word if character.isalnum()).lower()
            if raw_word == '':
                continue
            score += frequencies[raw_word]
        scores.append(score)

    sentence_scores = list(zip(sentences, scores))
    return sentence_scores
```
Great! We're almost done. Now that we have a list of sentences and their scores, we'll just need to return _the x highest rated sentences in order_. This is where the trick comes in. We don't need any intense NLP or ML because we're using sentences that already exist in the original text and just omitting sentences we've deemed unimportant.
```python
def build_summary(scores, limit):
    # build list of sentence indicies
    sentence_indices = []
    for index, score in enumerate(scores):
        sentence_indices.append((index, score[1]))

    # sort based on sentence score
    sorted_sentences = sorted(sentence_indices, key=lambda item: item[1])[::-1]

    # build list of highest ranked sentences
    summary_sentences = []
    for index in range(limit):
        if index < len(scores) - 1:
            summary_sentences.append(scores[sorted_sentences[index][0]][0])

    summary = ' '.join(summary_sentences)
    return summary

```
It's that simple!

### Producing more accurate summaries
You may have noticed that our code snippets from above do a pretty good job of summarizing text when it's formatted correctly, but what if the it comes from the web? News articles can have code, URLs, and other difficult items to parse. In addition, how do we actually pull the article text out of a news website's webpage?
Let's break down our problems a bit further:
1. How do we acquire our text from the internet?
2. How do we protect against unwanted words in our sentences (e.g. code, URLs, etc.)?
3. Can we make our summaries more accurate than our current approach?
4. Can we produce metrics on our summarization?

How would we solve these issues? Let's take them one at a time:
1. We can use [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/) to scrape the text content of a webpage if we have the URL. We can get the article text be selectively removing HTML components from the webpage.
2. We can add in some checks to remove unwanted components, like checking for code symbols (`==`, `+=`, `~`) and long words (URLs).
3. We could add a heuristic to weight sentences in the beginning of the article heavier. Sentences at the beginning of articles usually provide a more comprehensive summary, while later sentences provide more minor details.
4. We can perform some comparison based on the original text vs. our computed summary.

### Introducing smoosh
I wanted to see if I could combine our pseudocode from this article with the outline I laid out above into a helpful tool. The result was [smoosh]({{src:project/smoosh}}). Smoosh is a command line tool for summarizing text, just like SMMRY and autotldr. It uses a lot of the code snippets from above with some modifications to make the summaries even more accurate. You can find its source code [here](https://github.com/wcarhart/smoosh).
If you'd like to take it for a spin, it's easy to install with:
```bash
brew install wcarhart/tools/smoosh
smoosh --help
```
And then simple to run with:
```bash
smoosh 'https://www.cnn.com/2020/10/27/investing/amd-xilinx-purchase/index.html'
```

### Conclusion
I love taking seemingly complex problems and solving them elegantly with software. SMMRY is one of those tools that seems complicated at first glance, but is not actually too difficult to recreate. If you'd like to read more about smoosh, check out its [project page]({{src:project/smoosh}}) or [repository](https://github.com/wcarhart/smoosh). If you'd like to use the code snippets from this post, please access them [here](https://github.com/wcarhart/willcarh.art-snippets/blob/master/how-to-summarize-any-article-in-7-sentences-with-software/snippet.py). If you'd like to see smoosh in action, check out [lurker]({{src:project/lurker}}), which is another project I wrote that utilizes smoosh to read Hacker News threads on the terminal. You can try SMMRY for yourself [here](https://smmry.com/).
Please smoosh responsibly.

=🦉