# Slack handover — Server admin (previous deploy)

Copy-paste-friendly. Adjust SERVER_PATH if your prod checkout isn't `/opt/thalos`.

---

Hey 👋 — Update zur neuen Thalos-Website, die ihr letzten Sprint deployed habt. Wir haben den Stack komplett ersetzt.

**Branch:** `cms-content-editor` (nicht `master`, nicht `launch-landing-page`)
**Repo:** github.com/bio-trace/thalos_site
**Was neu ist:**
- Komplett neue Landing Page (Next.js 14, DE/EN, neue Copy, neues Design)
- Deploy: Docker container (`127.0.0.1:53000`) + host **nginx** + **certbot** (TLS) + **systemd** — kein Caddy
- Eingebauter CMS Editor unter `/admin/` — Sveltia CMS, GitHub-Backend, Content-Edits werden PRs gegen `master`
- Vollständig aktualisierte Legal Pages: Impressum, Datenschutz, AGB, **Widerruf (neu)** — direkt aus den DOCX-Vorlagen
- API-Route für Kontaktformular → Resend Email (Inbox: `notifications@thalos.at`)

**Was du tun musst, um auf neuen Stand zu kommen:**

```bash
cd /root/thalos_site                          # oder wo der Checkout liegt
git fetch origin
git checkout cms-content-editor
git pull origin cms-content-editor
cp .env.example .env                          # falls .env noch nicht existiert
# Setze in .env: RESEND_API_KEY (Resend Dashboard) + PARTNER_GYM_INBOX=notifications@thalos.at

# nginx vhost + TLS (einmalig)
cp deploy/thalos.at.nginx /etc/nginx/sites-enabled/thalos.at
nginx -t && systemctl reload nginx
certbot --nginx -d thalos.at -d www.thalos.at

# systemd service (baut + startet container, übersteht reboots)
cp deploy/thalos-site.service /etc/systemd/system/
systemctl daemon-reload && systemctl enable --now thalos-site
docker compose logs -f app                    # check ob alles läuft
```

**Smoke-Test nach Deploy:**
- https://thalos.at/ → Landing Page lädt
- https://thalos.at/de/impressum + /datenschutz + /agb + /widerruf → alle 4 Legal Pages erreichbar
- https://thalos.at/admin/ → Sveltia Login (PAT-Eingabe)
- Kontaktformular submit → Mail in `notifications@thalos.at` Inbox

**ENV vars die nicht ins Git committed sind und du selber setzen musst:**
| Variable | Wert | Wozu |
|---|---|---|
| `RESEND_API_KEY` | `re_PxLB4xU2_4G4EzPNxEZz8LhYeoUVqSaai` | Kontaktformular Email-Versand |
| `PARTNER_GYM_INBOX` | `notifications@thalos.at` | Empfänger für Form-Submissions |

**DNS:** Sollte schon stimmen (`A` Record `thalos.at` → eure Server IP). certbot holt das Let's-Encrypt-Cert (Port 80 offen + DNS resolved nötig).

**Branch-Strategie:**
- `master` → ist noch die **alte** PHP-Seite. NICHT überschreiben bis ihr final umzieht.
- `cms-content-editor` → neue Seite, aktuell zum Reviewen
- Wenn alles passt: PR aufmachen `cms-content-editor → master`, mergen, dann läuft das neue auf `master` weiter

**Rollback wenn was kaputt:**
```bash
git checkout <previous-sha>     # vorherigen Commit-Hash
docker compose up -d --build
```

Vollständige Deploy-Doku: `deploy/README.md` im Repo. CMS Editor-Guide für Content-Team: `docs/cms-editor-guide.md`.

Fragen → ping mich.
