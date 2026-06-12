# Kirkland Signature's

Static homepage for the Kirkland Signature's Rust server.

**Live:** [kirklandsignatures.eatglue.com](https://kirklandsignatures.eatglue.com)
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
└── maps/            Custom Rust maps for download (e.g. ProcG6V1.2.map)
```

## Deploy

The site lives at `kirklandsignatures.eatglue.com` on **Network Solutions** shared hosting
(document root `/htdocs/eatglue/kirklandsignatures`). DNS is on Cloudflare - the record is
proxied (orange cloud) and free Universal SSL covers `*.eatglue.com`, including this subdomain.

### Primary: git push (automatic)

Push to `main` and GitHub Actions FTP-deploys in ~60s (`.github/workflows/deploy.yml`).
This is the canonical deploy path - do not rely on upload-on-save from the editor.

FTP credentials live in **GitHub repo Secrets**, not in this repo:
`FTP_HOST`, `FTP_USERNAME`, `FTP_PASSWORD`. After the host migration these must be updated,
or the deploy silently keeps targeting the dead host.

### Manual / sync: VS Code SFTP extension

`.vscode/sftp.json` (gitignored - holds the password locally only) is configured for the
`SFTP` extension (`Natizyskunk.sftp`):

- **Download server -> local:** Ctrl+Shift+P -> `SFTP: Download Project`
- **Upload local -> server:** Ctrl+Shift+P -> `SFTP: Upload Project`

Current host details (keep both the GitHub Secrets and `.vscode/sftp.json` in sync if they change):

- **Host:** `ftp-a5349bf4.registeredsite.com`
- **Port:** 21 (plain FTP) - SFTP/SSH not available on this plan
- **User:** `rustydads`
- **Remote path:** `/` - the FTP user is scoped (chrooted) to `/htdocs/eatglue/kirklandsignatures`.
  If a download lands *above* the site, set `remotePath` to `/htdocs/eatglue/kirklandsignatures`.

## Adding a new map for players to download

1. Drop the `.map` file into `maps/` (e.g. `ProcG6V1.2.map`)
2. Reference it in `index.html` under a downloads section
3. Deploy (git push, or `SFTP: Upload Project`)
4. Point the Rust server's wipe schedule at `https://kirklandsignatures.eatglue.com/maps/<filename>.map`

## Admins

- liquidneck (owner)
- felps
- SilkyDurag

Other admins get GitHub Collaborator access on this repo plus their own scoped FTP user.
