---
layout: layouts/post.njk
status: public
author: Carlos
title: Linux Command Line Tips
date: 2022-03-30T10:35:00-04:00
categories:
  - TIL
tags:
  - linux
  - bash
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
