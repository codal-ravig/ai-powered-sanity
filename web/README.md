# Next.js Frontend: AI-Powered Sanity

This is the Next.js frontend for the **AI-Powered Sanity Project**. It consumes content from the Sanity Studio in the `/studio` directory.

## 🚀 Development

```bash
pnpm dev
```
Starts the frontend on `http://localhost:3000`.

## 📦 Key Scripts

- `pnpm build`: Builds the application for production.
- `pnpm lint`: Runs ESLint for code quality.
- `pnpm type-check`: Runs TypeScript type checking.

## 📁 Structure

- `src/app/`: App Router-based pages and layouts.
- `src/components/`: Reusable UI components.
- `src/lib/`: Core utilities and helper functions.
- `src/sanity/`: Sanity client, loaders, and generated types.

## 🧩 Sanity Integration

This frontend uses `next-sanity` and `groq` to fetch and render structured content. TypeScript types are generated automatically from the Sanity schema.

If you update the Sanity schema in `/studio`, make sure to run the following from the root directory:
```bash
pnpm typegen
```
