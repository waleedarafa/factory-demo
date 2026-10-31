# factory-demo

A tiny reading-list API used to test the marshal-factory end to end: a Linear ticket goes in, a pull request comes out.

```bash
bun install
bun run check   # typecheck and tests
bun start       # http://localhost:3000
```

## Endpoints

| Method | Path | What it does |
|---|---|---|
| GET | `/books?limit=N` | List books in the order added; `limit` is optional |
| POST | `/books` | Add a book: `{ "title": "...", "author": "..." }` |
| GET | `/books/:id` | Get one book |
| POST | `/books/:id/read` | Mark a book as read |

See `CLAUDE.md` for the conventions every change must follow.
