![Mugato Zoolander Meme: top: reactive web apps, bottom: so hot right now]({{cdn:img/blog/powering-dash-apps-with-bigquery/reactive-web-app-meme.jpeg}})
### A primer on Plotly and Dash
It's an average day as a software engineer during COVID-19. You said last night you'd be up by 8am but it's 8:30am and you're still in bed. You make sure to check Slack on your phone so your co-workers think you're online despite the fact that the covers are pulled up to your nose. At 8:57am, you groggily roll out of bed for your 9am Zoom standup and put on the same sweatshirt from yesterday you left wadded on the floor. While someone drones on about semicolon rules in the repo's `.eslintrc` you hop on Reddit and browse [r/DataIsBeautiful](https://www.reddit.com/r/dataisbeautiful/). You're now awake gazing wide-eye at the beautiful visuals other software engineers and data scientists are creating. Someone made an interactive voting map for the US down to the city. Someone else made a [COVID-19 tracker](https://www.reddit.com/r/dataisbeautiful/comments/kcy21p/oc_covid_19_dashboard_in_python_by_plotly_dash/), with a cool [demo video]({{cdn:img/blog/powering-dash-apps-with-bigquery/r-slash-data-is-beautiful-covid19-tracker.mp4}}). How do they make all this stuff so quickly?
The answer is [Plotly](https://plotly.com/python/) and [Dash](https://plotly.com/dash/). Built atop [D3.js](https://d3js.org/) and [stack.gl](http://stack.gl/), Plotly is a high-level, declarative charting library. Combined with Dash, a productive framework for building web analytic applications with highly custom user interfaces in pure Python atop of Flask, Plotly.js, and React.js, it's possible to rapidly develop complex, reactive web apps with ease.
Let's take a look at how we can build a powerful app from scratch using Plotly and Dash and data from GCP BigQuery.

### Building charts with Plotly
The word "Plotly" is a bit ambiguous due to how Plotly has evolved over time. Initially [Plotly.js](https://plotly.com/javascript/), Plotly has developed a wide variety of visualization and data science related tools. Plotly is the name of the [company](https://plotly.com/about-us/) behind the library, as well as the open-source library itself. It has graphing libraries for JavaScript (Plotly.js), Python, R, Julia, and more. For the rest of this article, when I mention Plotly I am talking about the Python Plotly library, unless otherwise noted.
Plotly is a mature, fully-featured library and can seem complicated to dive into. That's why Plotly (the company) created [Plotly Express](https://plotly.com/python/plotly-express/), a terse, consistent, high-level API for creating figures. Let's get started with the Dash/Plotly ecosystem with Plotly Express.
First, we'll need to install Plotly (and for Plotly Express, we'll also need [pandas](https://pandas.pydata.org/)). Let's do some housekeeping beforehand to prepare.
```
python3 -m virtualenv -p `which python3` venv
source venv/bin/activate
python -m pip install pandas
python -m pip install plotly
```
Next, let's use one of Plotly's dummy data sets to create a figure. For this example, we'll be using Plotly's _GDP per capita vs. life expectancy_ dataset, and interesting relationship to study (but that's beside the point). Let's create a new file call `app.py`.
```
import plotly.express as px
df = px.data.gapminder()
fig = px.scatter(df.query('year==2007'), x='gdpPercap', y='lifeExp', size='pop', color='continent', hover_name='country', log_x=True, size_max=60)
fig.show()
```
Now, we can run our app with `python app.py`, which should open a new tab in the browser to display the generated figure.
![Screenshot of generated Plotly figure of GDP per capita vs life expectancy]({{cdn:img/blog/powering-dash-apps-with-bigquery/plotly-demo-0.png}})<GDP Per Capita vs. Life Expectancy>
Pretty cool, right? Let's break down what we just built.
The first line `import plotly.express as px` just imports Plotly Express from where Pip installed it. It's standard to call Plotly Express `px` for brevity.
Next, we create a [pandas dataframe](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html), the standard data structure for pandas, from Plotly Express' test data set, which we instantiate with `px.data.gapminder()`. If you're curious, the data in the Gapminder dataset comes from [gapminder.org](https://www.gapminder.org/).
Then, we use our dataframe to create a new figure. There are many different kinds of figures we can create with Plotly Express. For this example, we're using `px.scatter`, but other common Plotly figures are `px.bar`, `px.line`, and `px.area`. For the complete list, see the [Plotly Express documentation](https://plotly.com/python-api-reference/plotly.express.html). Plotly Express is nice because it gives us a single entrypoint into Plotly, and thus `px.scatter` can be configured in many different ways, which we control by which parameters we pass into its instantiation. For instance, let's change our third line to the following.
```
fig = px.scatter(df, x="gdpPercap", y="lifeExp", animation_frame="year", animation_group="country",
           size="pop", color="continent", hover_name="country", facet_col="continent",
           log_x=True, size_max=45, range_x=[100,100000], range_y=[25,90])
```
Run our code again and we'll see that the figure has changed dramatically, even though we're still using `px.scatter`.
![Screenshot of updated Plotly graph of GDP per capita vs life expectancy]({{cdn:img/blog/powering-dash-apps-with-bigquery/plotly-demo-1.png}})<GDP Per Capita vs. Life Expectancy, grouped by continent, animated by year>
Finally, our last line `fig.show()` creates a [Flask](https://flask.palletsprojects.com/en/1.1.x/) server to serve the figure, and then tears it down as soon as the figure is rendered in the browser. As we can see, we can build powerful figures easily with just Plotly alone, but what if we want them to update dynamically? Next, let's take a look at Dash and see if we can turn our static figure into a reactive web application.

### Creating responsive web apps with Dash

### Loading data from BigQuery

### Our final product

### Conclusion