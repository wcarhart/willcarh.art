# Solve any Sudoku board instantly!

> Try it out! | Try out doku yourself on [the demo page]({{src:demo_index.html}})

### Solve puzzles instantly
Doku is an efficient Sudoku board solver, all from the command line.

### How it works
Doku uses dynamic programming and memoization to solve Sudoku boards. Essentially, doku strategically makes moves on the board and simulates the effect they will have. In order not to be overwhelmed with the immense number of possible board states, doku utilizes memoization to create a highly-pruned tree of board states and then performs a depth-first search to determine the solution.

### How to use it
You can specify input via a JSON file or a more human-readable text format. For some examples, see the [puzzles/](https://github.com/wcarhart/doku/tree/master/puzzles) folder in doku's repository.

For example, here is one possible input puzzle:
```
* * * | 5 * 6 | * * * 
* * 4 | * * * | 8 * * 
* 9 * | 1 * 2 | * 6 * 
---------------------
9 * 8 | * * * | 3 * 2 
* * * | * 9 * | * * * 
1 * 2 | * * * | 4 * 7 
---------------------
* 2 * | 3 * 4 | * 8 * 
* * 7 | * * * | 9 * * 
* * * | 9 * 5 | * * *
```

If this file was saved in `puzzle.txt`, you can solve it with:
```
doku puzzle.txt
```

Which would print:
```
2 8 1 | 5 4 6 | 7 3 9 
6 5 4 | 7 3 9 | 8 2 1 
7 9 3 | 1 8 2 | 5 6 4 
---------------------
9 7 8 | 4 6 1 | 3 5 2 
4 3 5 | 2 9 7 | 6 1 8 
1 6 2 | 8 5 3 | 4 9 7 
---------------------
5 2 9 | 3 7 4 | 1 8 6 
3 1 7 | 6 2 8 | 9 4 5 
8 4 6 | 9 1 5 | 2 7 3
```

Built with ❤️via [Deno](https://deno.land/).