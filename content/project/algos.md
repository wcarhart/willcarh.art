# Common algorithms. Standard data structures. And then some.

### Background
When I performed my last job search, I started by simply reimplementing all of the common algorithms and data structures I knew, in Python. The collection of code ended up being valuable outside of a job search, so I put it in a repository. Algos is constantly a work in progress and is always improving.

### Contents
Algos contains inplementations for tree data structures (BST, AVL, Trie, Bubble Tree, etc.), linked list data structures (queue, stack, Towers of Hanoi, etc.), sorting algorithms (mergesort, quicksort, heapsort, etc.), and much more. To see everything, check out [the repo](https://github.com/wcarhart/algos).

### A new kind of tree: Bubble Tree
In addition to standard tree data structures, I created a new data structure called _Bubble Tree_. Bubble Tree is a tree structure that bubbles up common values and prunes congruent subtrees. It is used for storing key value pairs, where keys are Linux paths and values are any data structure that is comparable.

Build a Bubble Tree:
```
>>> from trees import BubbleTreeNode
>>> bt = BubbleTreeNode('root')
```
Insert nodes into the tree via absolute Linux paths:
```
>>> bt.insert('/root/dir0/dir00/file000.txt', value=10)
>>> bt.insert('/root/dir0/file00.txt', value=10)
>>> bt.insert('/root/dir1/file10.txt', value=5)
>>> bt.insert('/root/dir2/file20.txt', value=10)
>>> bt.insert('/root/dir2/file21.txt', value=15)
>>> bt.insert('/root/dir3/dir30/file300.txt', value=15)
>>> bt.insert('/root/dir3/file30.txt', value=10)
```
Bubble up common values to prune the tree:
```
>>> print(bt)
└── root
    ├── dir0
    |   ├── dir00
    |   |   └── file000.txt (10)
    |   └── file00.txt (10)
    ├── dir1
    |   └── file10.txt (5)
    ├── dir2
    |   ├── file20.txt (10)
    |   └── file21.txt (15)
    └── dir3
        ├── dir30
        |   └── file300.txt (15)
        └── file30.txt (10)
>>> bt.bubble()
>>> print(bt)
└── root
    ├── dir0 (10)
    ├── dir1 (5)
    ├── dir2
    |   ├── file20.txt (10)
    |   └── file21.txt (15)
    └── dir3
        ├── dir30 (15)
        └── file30.txt (10)
```
Flatten the tree into a dictionary of key-value pairs:
```
>>> bt.flatten()
{
  '/root/dir0': 10,
  '/root/dir1': 5,
  '/root/dir2/file20.txt': 10,
  '/root/dir2/file21.txt': 15,
  '/root/dir3/dir30': 15,
  '/root/dir3/file30.txt': 10
}
```