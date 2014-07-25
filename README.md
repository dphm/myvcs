myvcs
=====

Local version control system (Hacker School Friday Challenge #5)

Usage
=====
    node '/path/to/myvcs.js' backup          # Creates a new backup for current directory in .myvcs
    node '/path/to/myvcs.js' checkout n      # Reverts current directory to backup .myvcs/n
    node '/path/to/myvcs.js' latest          # Reverts current directory to latest backup

* Recursively copies current directory into `.myvcs` directory
* Backups in `.myvcs` are in numbered directories starting from 0
