---
layout: layouts/post.njk
status: public
title: Yubikey for 2FA Login and Full-Disk Encryption
date: 2022-09-28T20:06:00-04:00
categories:
  - TIL
tags:
  - linux
  - security
---

How to use a Yubikey for 2FA on KDE login and LUKS full-disk encryption on Kubuntu 22.04.

## Login

1. Install Yubikey software and associate your key:

```bash
sudo add-apt-repository ppa:yubico/stable && sudo apt-get update
sudo apt-get install libpam-u2f -y
mkdir -p ~/.config/Yubico
pamu2fcfg > ~/.config/Yubico/u2f_keys
# Touch the key when it flashes
pamu2fcfg -n >> ~/.config/Yubico/u2f_keys  # backup key
```

2. Add this line after `@include common-auth` in `/etc/pam.d/sddm`:

```
auth       required   pam_u2f.so
```

3. Enable autologin in Settings > Login Screen > Behavior.

## Full-Disk Encryption

4. Configure Yubikey slot 2 (repeat for backup key):

```bash
ykpersonalize -2 -ochal-resp -ochal-hmac -ohmac-lt64 -oserial-api-visible
```

5. Find your encrypted drive and available LUKS slots:

```bash
lsblk --fs | grep crypto
sudo cryptsetup luksDump /dev/nvme1n1p3
```

6. Enroll the key:

```bash
sudo yubikey-luks-enroll -d /dev/nvme1n1p3 -s 2
sudo yubikey-luks-enroll -d /dev/nvme1n1p3 -s 3  # backup
```

7. Update `/etc/crypttab`:

```
nvme0n1p3_crypt UUID=[uuid-here] none luks,keyscript=/usr/share/yubikey-luks/ykluks-keyscript,discard
```

8. Update `/etc/ykluks.cfg`:

```ini
WELCOME_TEXT="Please insert yubikey and press enter or enter a valid passphrase"
CONCATENATE=0
HASH=0
YUBIKEY_LUKS_SLOT=2
```

9. Update initramfs and reboot:

```bash
sudo update-initramfs -u
```

Sources: [Yubico PPA](https://support.yubico.com/hc/en-us/articles/360016649039), [Ubuntu Login Guide](https://support.yubico.com/hc/en-us/articles/360016649099), [Disk Decryption](https://www.endpointdev.com/blog/2022/03/disk-decryption-yubikey/)
