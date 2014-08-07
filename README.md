myvcs
=====

Local version control system (Hacker School Friday Challenge #5)

Usage
=====
    myvcs backup          # Creates a new backup for current directory in .myvcs
    myvcs checkout n      # Reverts current directory to backup .myvcs/n
    myvcs latest          # Reverts current directory to latest backup
    myvcs current         # Prints the number of the current backup

* Path to myvcs directory should be added to PATH variable
* Recursively copies current directory into `.myvcs` directory
* Backups in `.myvcs` are in numbered directories starting from 1

TODO
====
Copied from Hackpad:

### Part 2 - Metadata
2. **Logging dates.**  However you decide to do it, store the date of each snapshot as it's created. `myvcs log` should print a list of the backups & their creation dates.
3. **Messages.**  Add a way to leave a note about each backup when it's created, for example `myvcs backup -m "add readme"`.  Alter `myvcs log` to show the message as well as the date for each backup.
4. **Diffs.** Print the difference between two snapshots with `myvcs diff 1 12`
5. **Branches.**  Here's the fun part!  Using the head data from in item 5, store the parent of each backup as it's made.  Then alter `myvcs log` to only print information about the current backup's ancestors.
