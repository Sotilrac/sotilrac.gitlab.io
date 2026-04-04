---
layout: layouts/post.njk
status: public
author: Carlos
title: Unfreeze a Stuck SSH Terminal
date: 2021-12-08T18:38:00-05:00
categories:
  - TIL
tags:
  - ssh
---

When an SSH session hangs (network drop, server reboot), the terminal appears frozen. To kill it, type this escape sequence:

`Enter`, `~`, `.`

Other useful SSH escape sequences:

- `~.` terminate connection (and any multiplexed sessions)
- `~B` send a BREAK to the remote system
- `~C` open a command line
- `~R` request rekey (SSH protocol 2 only)
- `~^Z` suspend ssh
- `~#` list forwarded connections
- `~&` background ssh (when waiting for connections to terminate)
- `~~` send the escape character literally
