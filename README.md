# Rusty Dads

Static homepage for the Rusty Dads Rust server.

**Live:** [rustydads.eliecom.com](https://rustydads.eliecom.com)
**Discord:** [discord.gg/9rS7GVxuXp](https://discord.gg/9rS7GVxuXp)
**Game IP:** `135.148.136.48:60408`

## Stack

Plain static HTML / CSS / vanilla JS. No build step, no framework.

```
.
├── index.html       Main page
├── css/style.css    All styles
├── js/main.js       Copy-IP helper
├── img/             Logos and graphics
└── maps/            Custom Rust maps for download (e.g. Wild Valley 2500)
```

## Deploy

The site lives at `rustydads.eliecom.com` on iPage hosting. Upload via FTP:

- **Host:** `ftp.cadenelhabr.com`
- **Port:** 21 (FTP) - SFTP/2222 currently broken on this host
- **User:** scoped to `/rustydads/` only
- **Tool:** VS Code `ftp-simple` extension - run `ftp-simple: Save - Upload to FTP server` after editing

## Adding a new map for players to download

1. Drop the `.map` file into `maps/`
2. Reference it in `index.html` under a downloads section
3. Upload via ftp-simple
4. Update the Rust server's wipe schedule to use `https://rustydads.eliecom.com/maps/<filename>.map`

## Admins

- liquidneck (owner)
- felps
- SilkyDurag

Other admins get GitHub Collaborator access on this repo plus their own scoped FTP user.
