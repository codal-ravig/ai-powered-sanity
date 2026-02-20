# AI-Powered Sanity Project

This is a modern, full-stack monorepo featuring a Sanity Studio and a Next.js frontend application. The project is managed with `pnpm` workspaces for efficient dependency management and developer experience.

## 🏗️ Project Structure

- **`/studio`**: Sanity Studio v5 configuration (package name: `my-bakery`).
- **`/web`**: Next.js frontend application with Tailwind CSS and Framer Motion.
- **`rules/`**: Custom project-specific Sanity configuration and guidance.

## 🛠️ Tech Stack

### Studio
- **Sanity**: Structured content management.
- **Plugins**: Color input, Dashboard, Media browser, and Vision.
- **Faker.js**: For generating seed data.
- **Sanity TypeGen**: For automated TypeScript type generation.

### Web
- **Next.js**: React framework for the frontend.
- **Sanity Client**: For fetching data from the Sanity Content Lake.
- **Tailwind CSS**: Utility-first styling.
- **Framer Motion**: For smooth UI animations.
- **Lucide React**: Icon library.

## 🚀 Getting Started

1.  **Install dependencies**:
    ```bash
    pnpm install
    ```

2.  **Start development servers**:
    ```bash
    pnpm dev
    ```
    This will start both the Sanity Studio (usually on `http://localhost:3333`) and the Next.js frontend (usually on `http://localhost:3000`).

## 📜 Available Scripts

### Root Commands
- `pnpm dev`: Runs both studio and web in development mode.
- `pnpm build`: Builds all packages for production.
- `pnpm studio:dev`: Runs only the Sanity Studio.
- `pnpm web:dev`: Runs only the Next.js frontend.
- `pnpm typegen`: Generates TypeScript types based on your Sanity schema.
- `pnpm lint`: Runs linting for the web application.
- `pnpm type-check`: Runs TypeScript type checking for the web application.

### Studio-Specific Commands (`/studio`)
- `pnpm seed`: Generates seed data using `generate-seed.ts`.
- `pnpm import:data`: Imports the generated seed data into your Sanity dataset.
- `pnpm deploy`: Deploys your Studio to Sanity hosting.

## 🧩 Sanity Integration

This project uses **Sanity TypeGen** to ensure type safety between your content schema and your frontend.

When you modify your schema in `/studio`, you should run:
```bash
pnpm typegen
```
This will extract the schema and generate updated TypeScript types in both the `studio` and `web` directories.

## 🤖 AI Features & MCP

This project is configured for AI-enhanced development. See [`.gemini/GEMINI.md`](.gemini/GEMINI.md) for detailed guidance on using the Sanity MCP server and project-specific rules.
