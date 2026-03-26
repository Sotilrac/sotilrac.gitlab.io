---
layout: layouts/post.njk
status: public
title: Windows Tips
date: 2023-01-05T13:21:00-05:00
categories:
  - TIL
tags:
  - windows
---

Notes from the times I had to deal with Windows.

## Debloat Windows 10

In an admin PowerShell:

```powershell
iex ((New-Object System.Net.WebClient).DownloadString('https://git.io/JJ8R4'))
```

Opens a GUI to uninstall bundled apps and install useful tools. Source: [christitus.com](https://christitus.com/debloat-windows-10-2020/)

## Scoop Package Manager

[Scoop](https://scoop.sh/) installs programs from PowerShell, all in user space:

```powershell
Set-ExecutionPolicy RemoteSigned -scope CurrentUser
Set-ExecutionPolicy -s cu unrestrict
iwr -useb get.scoop.sh | iex
```

## Windows 11 in VirtualBox

VM settings: 4+ GB RAM, EFI enabled, 2+ CPUs, 64 GB disk, 256 MB video with VBoxSVGA and 3D acceleration.

To bypass the TPM/Secure Boot check:

1. Start the installer, click Next until "Install now" appears
2. Press `Shift+F10` to open a command prompt, run `regedit`
3. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\Setup`
4. Create a key called `LabConfig`
5. Add three DWORD (32-bit) values set to `1`:
   - `BypassTPMCheck`
   - `BypassRAMCheck`
   - `BypassSecureBootCheck`
6. Close regedit and the prompt, then click "Install now"

Source: [Oracle Virtualization Blog](https://blogs.oracle.com/virtualization/post/install-microsoft-windows-11-on-virtualbox)
