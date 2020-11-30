# My foray into programming.

### Some context
I wrote my first piece of code my sophomore year in high school, on a [Texas Instruments 84 calculator](https://en.wikipedia.org/wiki/TI-84_Plus_series). The TI83 and TI84 family of calculators were [incredibly powerful](https://www.reddit.com/r/explainlikeimfive/comments/20awwi/eli5eli5_is_it_true_that_there_is_more_processing/) and served as my introduction to programming.
Originally, I only wrote programs for simple formulae for math and physics classes. Although the TI83/84 calculators use the Z80 instruction set, I wrote everything in the calculator's interpreted language, [TI-BASIC](https://en.wikipedia.org/wiki/TI-BASIC). Eventually, I moved beyond simple text I/O programs and into simple games and graphics programs.
TicTacToe is one of the last calculator programs I wrote in high school. It's incredibly inefficient, takes forever to compute moves, and should have been written in Z80 instead of TI-BASIC. However, it still holds a special place in my heart as the _end of the beginning_ of my coding hobby.

### Programming in TI-BASIC
TI-BASIC is a great way to learn programming. It exposes simple programming concepts, like loops and arrays, all from the calculator's interface. However, it comes with some quirks, too. For example, there are a limited number of variable options. For storing numbers, you have 26 uppercase letters available for variables, as well as a few lowercase and greek letters.

### How it works
TicTacToe stores all of the game's board grid in a single array, with `1` for a O, `2` for a X, and `0` for empty. The player places moves by using the corresponding number key (1-9) for the game's grid. When a player provides input, the program loops through the whole array and determines (a) the validity of the move, (b) the effects of the move, and (c) the game state. The program has win detection and keeps track of score. It then draws updates to the screen.
![Demo of TI TicTacToe](https://github.com/wcarhart/TI84-TicTacToe/blob/master/tic-tac-toe.gif?raw=true)<TI TicTacToe running on a TI84+ emulator>
This program is compatible with the TI83, TI83+, TI83+ SE, TI84, TI84+, and TI84+ SE calculators.