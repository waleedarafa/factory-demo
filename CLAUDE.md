# factory-demo

A small reading-list HTTP API on Bun and TypeScript. It exists to test the Pilots factory end to end.

## Commands

- `bun install`: install dependencies
- `bun run check`: typecheck, then run every test. Run it before opening a PR; CI runs the same.
- `bun start`: serve the API on port 3000

## Layout

- `src/store.ts`: the in-memory `BookStore`. All data rules live here.
- `src/server.ts`: `createApp()`, the request handler. It parses requests, validates input and maps results to HTTP responses. It holds no data rules.
- `src/index.ts`: starts the server. Keep it tiny.
- `test/`: `bun:test` tests that call `createApp()` directly, without a network.

## Conventions

- Every behaviour change comes with a test in `test/` that fails before the change and passes after it.
- Errors are JSON: `{ "error": "<message>" }`, with the right status (400 bad input, 404 missing, 405 wrong method).
- Validation happens in `src/server.ts`; the store trusts its inputs.
- No new dependencies without a reason stated in the PR description.
- Strict TypeScript: no `any`, no `@ts-ignore`.
- Keep functions small and names plain. Comments explain why, not what.
