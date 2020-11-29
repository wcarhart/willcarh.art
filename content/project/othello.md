# Play Othello on the command line.

### Simple concept, complex theory
Othello is a simple game. Players take turns placing disks on a 8x8 grid with their assigned color, either black or white. If any of a player's disks are _sandwiched_ between their opponent's disks, they are flipped colors. Although the premise is simple, the game's theory is quite complex, because often the winner of the game is only decided in the last few moves.
Othello can be played with either two human players or one human and one AI player.

### A case study in game theory
Othello's AI adversaries (_Euclid_, _Lovelace_, _Dijkstra_, and _Turing_), which are named after famous computer scientists, use knowledge of the game's theory to try to win the game. The most challenging of the AI players, Turing, uses concepts like mobility to dominate most players.

### Playing the game
Start a new game with `othello.py`.
```
python othello.py
```
```
Welcome to Othello!
Player 1 vs. Player 2

  1 2 3 4 5 6 7 8
A - - - - - - - - 
B - - - - - - - - 
C - - - - - - - - 
D - - - * * - - - 
E - - - * * - - - 
F - - - - - - - - 
G - - - - - - - - 
H - - - - - - - - 
Player 1, where do you want to move? 
```
The available commands can be shown by typing `help`.
```
====Command list====
 B6     -> attempts to place new tile on location B6
 show   -> redraws the current board
 where  -> shows possible moves for the current player (you can also use 'hint' or 'where can I go?')
 help   -> shows this menu and list of commands (you can also use 'command' or 'commands')
 clear  -> clears the screen
 score  -> show how many tiles each player has (you can also use 'who's winning?')
 color  -> changes the current player's color
 exit   -> ends the game (you can also use 'done')
```
Othello's coolest feature, its AI players, can be played by specifying them by name.
```
python othello.py --adversary Turing
```
```
So, you'd like to challenge Turing? (Y/N) y
What is your name? Will
Okay, so your name is Will? (Y/N) y
Okay, what is your color? You can pick from grey, red, green, yellow, blue, pink, teal, or white: red
Okay so your color is red? (Y/N) y

Welcome to Othello!
Will vs. Turing
Turing says: My bombes will win this game in no time!

  1 2 3 4 5 6 7 8
A - - - - - - - - 
B - - - - - - - - 
C - - - - - - - - 
D - - - * * - - - 
E - - - * * - - - 
F - - - - - - - - 
G - - - - - - - - 
H - - - - - - - - 
Will, where do you want to move? 
```
You can also watch a game between two AI players with the `--spectate` option.
```
python othello.py --spectate
```