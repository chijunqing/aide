# .

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

# Environment Configuration

## API Configuration

The application uses environment variables to configure the API base URL. You can set these variables in different ways:

### 1. Environment Files

- `.env` - Default environment variables
- `.env.production` - Production environment variables
- `.env.development` - Development environment variables

### 2. Build-time Configuration

You can override the API base URL during build time using the `VITE_API_BASE_URL` environment variable:

```bash
# Development build
npm run dev

# Production build with custom API URL
VITE_API_BASE_URL=https://api.example.com npm run build
```

### Default Values

If no environment variable is specified, the application will use the default value:
- Development: `http://127.0.0.1:7081`
- Production: `http://api.example.com`

## Configuration Files

The API configuration is managed in `src/config/api.ts`. This file:
- Defines the API configuration interface
- Provides default values
- Exports utility functions for API URL construction
