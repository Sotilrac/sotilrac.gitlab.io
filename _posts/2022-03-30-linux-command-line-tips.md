---
layout: layouts/post.njk
status: public
author: Carlos
title: Linux Command Line Tips
date: 2022-03-30T10:35:00-04:00
categories:
  - Software
tags:
  - linux
  - bash
  - ssh
---

A growing collection of command line tricks.

## Bash `shift`

The `shift` command removes the first positional argument, shifting the rest down by one. Useful for iterating over a variable number of arguments:

```bash
while (( "$#" )); do
    echo "$1"
    shift
done
```

## Inline Variable Definition

Define a variable and use it in the same command chain:

```bash
U=USER_DEST; cp -r USER_SRC/.aws $U; chown -R $U:$U $U
```

## Find Files by Name

```bash
find . -name someCaseSensitiveName.md
find . -iname someCaseInsensitiveName.md
```

`-iname` ignores case.

## rsync

```bash
rsync -azP source destination
rsync -azP --delete source destination  # also delete removed files
```

`-a` archive, `-z` compress, `-P` progress and resume.

## Unattended Upgrades (Ubuntu)

```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## Update Snap Packages

```bash
sudo snap refresh
```

## Shell Navigation Shortcuts

From [Shell Tricks That Actually Make Life Easier](https://blog.hofstede.it/shell-tricks-that-actually-make-life-easier-and-save-your-sanity/):

| Shortcut            | Action                            |
| ------------------- | --------------------------------- |
| `Ctrl+R`            | Reverse search through history    |
| `Ctrl+W`            | Delete word before cursor         |
| `Ctrl+U`            | Cut from cursor to line start     |
| `Ctrl+K`            | Cut from cursor to line end       |
| `Ctrl+Y`            | Paste previously cut text         |
| `Ctrl+A` / `Ctrl+E` | Jump to start / end of line       |
| `Alt+B` / `Alt+F`   | Move back / forward one word      |
| `Ctrl+X, Ctrl+E`    | Edit current command in `$EDITOR` |

## Quick Tricks

`cd -` switches to the previous directory.

`!!` expands to the previous command. Most common use:

```bash
sudo !!
```

`!$` expands to the last argument of the previous command:

```bash
mkdir my-new-dir
cd !$
```

Brace expansion for quick copies:

```bash
cp config.yml{,.bak}   # copies config.yml to config.yml.bak
```

Empty a file without removing it (preserves permissions):

```bash
> file.txt
```

## Background and Detach a Running Process

Accidentally started a long process in the foreground? `Ctrl+Z` suspends it, then:

```bash
bg       # resume it in the background
disown   # detach it from the shell so it survives logout
```

## Fix a Garbled Terminal

If binary output corrupts your terminal:

```bash
reset
```

## Unfreeze a Stuck SSH Terminal

When an SSH session hangs (network drop, server reboot), the terminal appears frozen. To kill it, type this escape sequence:

`Enter`, `~`, `.`

Other useful SSH escape sequences:

| Sequence | Action                              |
| -------- | ----------------------------------- |
| `~.`     | Terminate connection                |
| `~B`     | Send a BREAK to the remote system   |
| `~C`     | Open a command line                 |
| `~R`     | Request rekey (SSH protocol 2 only) |
| `~^Z`    | Suspend ssh                         |
| `~#`     | List forwarded connections          |
| `~&`     | Background ssh                      |
| `~~`     | Send the escape character literally |
