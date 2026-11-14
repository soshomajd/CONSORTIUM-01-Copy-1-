# GitHub Pages design preview

This repository contains a UI/UX prototype with demo data.

## Initial connection

1. Create a public repository on the owner's GitHub account and push this project
   at the repository root, including `.figma/` and `.github/`.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions**.
3. Run **Deploy design preview to GitHub Pages** from the Actions tab, or push
   another commit to `main`.
4. Read the deployed URL from the successful `github-pages` deployment.

Each subsequent push to `main` rebuilds and publishes the preview at that same
GitHub Pages URL. A commit must be pushed before it can deploy. A failed build
leaves the previous successful publication in place.

The workflow uses Node 22, pnpm 10.34.3, and the committed pnpm lockfile. It sets
the asset base from Pages metadata and enables hash routing only for Pages builds
(for example, `<site-url>/#/cart`). This allows direct links and refreshes on
static hosting. Local development and the existing Sites build use browser routes.

## Collaborator requested by the owner

After the repository exists, invite `gwall2524-lab` with **Write** permission from
**Settings → Collaborators**. They must accept the invitation before they can push.
This is a requested setup step, not a record that access has already been granted.

## Local commands

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
```

To reproduce a project Pages build in PowerShell (substitute the repository name):

```powershell
$env:VITE_GITHUB_PAGES = 'true'
pnpm build --base /repository-name/
Remove-Item Env:VITE_GITHUB_PAGES
```

The prior Sites identity in `.openai/hosting.json` is retained. GitHub Pages has
its own URL; pushing to GitHub does not update the old Sites URL.
