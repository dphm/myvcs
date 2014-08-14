myvcs
=====

Local version control system (Hacker School Friday Challenge #5)

Usage
=====
    myvcs backup [-m <msg>] # Creates a new backup for current directory in .myvcs
    myvcs checkout n        # Reverts current directory to backup .myvcs/n
    myvcs latest            # Reverts current directory to latest backup
    myvcs current           # Prints the number of the current backup
    myvcs log               # Prints a list of backups and their creation dates and messages

* Recursively copies current directory into `.myvcs` directory
* Backups in `.myvcs` are in numbered directories starting from 1

TODO
====
Copied from Hackpad:

### Part 2 - Metadata
4. **Diffs.** Print the difference between two snapshots with `myvcs diff 1 12`
5. **Branches.**  Here's the fun part!  Using the head data from in item 5, store the parent of each backup as it's made.  Then alter `myvcs log` to only print information about the current backup's ancestors.
