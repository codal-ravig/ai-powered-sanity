# Sanity Studio: my-bakery

This is the Sanity Studio for the **AI-Powered Sanity Project**. It provides a real-time editing environment for structured content, which is consumed by the Next.js frontend in the `/web` directory.

## 🚀 Development

```bash
pnpm dev
```
Starts the Studio on `http://localhost:3333`.

## 📦 Key Scripts

- `pnpm seed`: Generates seed data using Faker.js (see `generate-seed.ts`).
- `pnpm import:data`: Imports the generated seed data into the Sanity Content Lake.
- `pnpm typegen`: Extracts schema and generates TypeScript types.
- `pnpm deploy`: Deploys the Studio to Sanity hosting.

## 📁 Structure

- `schemaTypes/`: Defines the content models (documents and objects).
- `migrations/`: Contains Sanity data migrations.
- `presentation/`: Configuration for Sanity Presentation and Visual Editing.

## 🛠 Plugins

- `@sanity/color-input`: Visual color picker.
- `@sanity/vision`: GROQ query playground.
- `sanity-plugin-media`: Advanced media browser.
- `sanity-plugin-dashboard-widget-document-list`: Dashboard shortcuts.
