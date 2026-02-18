This is a pnpm monorepo with a Sanity Studio.

## Monorepo Management
You can manage the entire project from this root directory using `pnpm`.

- `pnpm install`: Install dependencies for all packages.
- `pnpm dev`: Run all packages in dev mode.
- `pnpm studio:dev`: Run only the Sanity Studio dev server.
- `pnpm -C studio [command]`: Run any command inside the `studio` folder.

## Folder Structure
- `/studio`: The Sanity Studio configuration.
- `/frontend`: (Planned) The frontend application.
- `pnpm-workspace.yaml`: Defines the workspace packages.
