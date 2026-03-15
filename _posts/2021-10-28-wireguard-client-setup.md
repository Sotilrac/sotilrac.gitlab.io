---
layout: layouts/post.njk
status: public
title: WireGuard Client Setup
date: 2021-10-28T19:17:00-04:00
categories:
- TIL
tags:
- linux
- vpn
---
After setting up a WireGuard server, configure a Linux client:

```bash
sudo apt install wireguard resolvconf -y
sudo touch /etc/wireguard/wg0.conf
sudo nano /etc/wireguard/wg0.conf
```

The config should look like this:

```ini
[Interface]
PrivateKey = DESKTOP_CLIENT_PRIVATE_KEY
Address = 10.0.0.2/24

[Peer]
PublicKey = YOUR_SERVER_PUBLIC_KEY
Endpoint = YOUR_SERVER_IP_ADDRESS:54321
AllowedIPs = 0.0.0.0/0
```
