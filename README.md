This is a pnpm monorepo with a Sanity Studio.

## Monorepo Management
You can manage the entire project from this root directory using `pnpm`.

- `pnpm install`: Install dependencies for all packages.
- `pnpm dev`: Run all packages (studio and web) in dev mode.
- `pnpm studio:dev`: Run only the Sanity Studio dev server.
- `pnpm web:dev`: Run only the Next.js frontend dev server.
- `pnpm -C studio [command]`: Run any command inside the `studio` folder.
- `pnpm -C web [command]`: Run any command inside the `web` folder.

## Folder Structure
- `/studio`: The Sanity Studio configuration.
- `/web`: The Next.js frontend application.
- `pnpm-workspace.yaml`: Defines the workspace packages.
