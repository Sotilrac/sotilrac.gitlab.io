---
layout: layouts/post.njk
status: public
title: WireGuard VPN Server Setup
date: 2023-12-15T10:20:00-05:00
categories:
  - TIL
tags:
  - linux
  - vpn
---

Quick WireGuard VPN server setup using [ansible-easy-vpn](https://github.com/notthebee/ansible-easy-vpn).

## Server

```bash
apt-get update && apt-get full-upgrade -y
wget https://notthebe.ee/vpn -O bootstrap.sh && bash bootstrap.sh
```

## Client

Get a `wg0.conf` file from the server and copy it to `/etc/wireguard/`.

```bash
wg-quick up wg0        # connect
wg-quick down wg0      # disconnect
```
