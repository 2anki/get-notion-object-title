# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm test` — run vitest once
- `npm run test:watch` — vitest in watch mode
- `npm run coverage` — vitest with coverage
- `npm run lint` / `npm run lint:fix` — ESLint over `*.ts`
- `npm run build` — clean `dist/`, run `tsc`, then `vite build` (produces ES + CJS bundles plus `.d.ts` declarations)

Run a single test by name: `npx vitest run -t "page title should be 'Page Title'"`.

## Architecture

This is a tiny single-purpose npm package: given a Notion API object, return a human-readable title string. The full public surface is `getNotionObjectTitle(notionObject, { emoji?: boolean })` exported from `src/get-notion-object-title.ts`.

Dispatch in `getNotionObjectTitle` is by object kind, in this order:

1. **Page** (`isFullPage`): scans `page.properties` for the first key in `['title', 'Page', 'Name', 'Topic']` whose value yields text via `getTitleFromProperty` (which handles both `title` and `rich_text` shaped properties). If none of those keys match, it falls back to concatenating the text of *all* properties in reverse key order — this is what lets `unknown-prop-key.json` resolve. Page icon emoji is prepended unless `emoji: false`.
2. **Database** (`isFullDatabase`): uses the top-level `title` rich-text array. Same icon rule.
3. **Block-like** (anything with a `.type`): delegated to `getTextFromBlock` in `src/getTextFromBlock.js` — this file is vendored from `makenotion/notion-sdk-js`'s `parse-text-from-any-block-type` example and intentionally kept as JS. Touch it sparingly; updates should track upstream.
4. Otherwise returns `'Untitled'`.

The local `Icon` type union in `get-notion-object-title.ts` exists because `@notionhq/client`'s exported types don't expose a single icon union that includes `custom_emoji`. For `custom_emoji`, the emoji *name* is returned as a fallback since the actual image can't be rendered in a string.

## Tests

Vitest lives alongside the source. Fixtures in `src/__mocks/*.json` are real-shape Notion API responses — when adding behavior, add a fixture rather than hand-constructing objects in the test.

## Release

Publishing is automated via `semantic-release` from `main` (see `.releaserc.json` and `.github/`). Commit messages drive the version bump, so use Conventional Commits (`fix:`, `feat:`, `build(deps):`, etc. — see recent `git log`).
