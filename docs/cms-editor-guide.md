# CMS Editor Guide

The Thalos site has a built-in content editor at **https://thalos.at/admin/**. Use it to update team members, FAQ entries, legal text, UI strings, and images — without using git, a code editor, or a local dev environment.

Every save opens a pull request on GitHub. A maintainer reviews and merges. Once merged, the live site rebuilds automatically (1–2 minutes).

## One-time setup

1. **Get a GitHub account** if you don't have one — https://github.com/join.
2. **Ask the maintainer (Patrick) to add you as a collaborator** to the repository. You'll receive an email invite — accept it.
3. **Generate a personal access token (PAT)**:
   - Go to https://github.com/settings/personal-access-tokens/new
   - **Token name**: `thalos-cms` (or anything memorable)
   - **Resource owner**: select the org/user that owns the repo
   - **Expiration**: 90 days
   - **Repository access**: "Only select repositories" → pick the thalos website repo
   - **Permissions** → "Repository permissions":
     - **Contents**: Read and write
     - **Metadata**: Read-only (auto-selected)
     - **Pull requests**: Read and write
   - Click **Generate token**. **Copy the token now** — you cannot see it again.
4. **Save the token somewhere safe** (password manager). You'll paste it once into the editor.

## Logging in

1. Open https://thalos.at/admin/
2. Paste your PAT into the login form.
3. The token is saved in your browser only. No server stores it.
4. You'll need to log in again on a new device or after clearing browser data.

## Editing content

The editor sidebar shows four collections:

- **Team** — one card per member. Add, edit, reorder via the `Sort order` field, or delete.
- **FAQ** — one entry per question. Same controls.
- **Legal** — four fixed documents (Impressum, Datenschutz, AGB, Widerruf). Edit body text using the rich-text editor.
- **UI Strings** — site text in German and English. Fields are grouped by section (hero, nav, etc.).

To upload a new team photo: open the team member, click the image field, drop a new file. The image is uploaded to `/public/images/team/` and the team entry is updated to point to it.

## Saving — and the PR flow

Every save creates a pull request:

1. Click **Save** in the editor.
2. The editor pushes your changes to a new branch named `cms/<collection>/<slug>` and opens a PR against `master`.
3. The PR appears on GitHub. A maintainer reviews the changes.
4. If a check fails (e.g. you removed a required UI string), the PR is blocked — fix it in the editor and save again.
5. Once approved + merged, the site rebuilds and your change goes live in 1–2 minutes.

## Rotating your token

PATs expire every 90 days. When yours expires:

1. Generate a new one (same steps as setup).
2. Log out of the editor, paste the new token.
3. Delete the expired token from your GitHub settings.

## Troubleshooting

- **"Authorization failed"** — your PAT is expired or has the wrong scopes. Generate a new one.
- **"Branch is out of date"** — someone else's PR was merged. The editor auto-rebases; if it can't, ask the maintainer.
- **"Validation failed" in your PR** — usually a UI string was removed or has the wrong type. The error mentions the field. Fix it in the editor and save again.
