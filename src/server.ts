import { BookStore } from "./store";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

const error = (status: number, message: string) => json({ error: message }, status);

/** Builds the request handler. Tests call it directly; src/index.ts serves it. */
export function createApp(store = new BookStore()) {
  return async function handle(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const parts = url.pathname.split("/").filter(Boolean);

    if (parts[0] !== "books") return error(404, "not found");

    // /books
    if (parts.length === 1) {
      if (req.method === "GET") {
        const raw = url.searchParams.get("limit");
        const limit = raw === null ? undefined : Number(raw);
        if (limit !== undefined && (!Number.isInteger(limit) || limit < 0)) {
          return error(400, "limit must be a non-negative integer");
        }
        return json(store.list(limit));
      }
      if (req.method === "POST") {
        const body = (await req.json().catch(() => null)) as { title?: unknown; author?: unknown } | null;
        if (!body || typeof body.title !== "string" || typeof body.author !== "string") {
          return error(400, "title and author are required strings");
        }
        return json(store.add({ title: body.title, author: body.author }), 201);
      }
      return error(405, "method not allowed");
    }

    // /books/:id and /books/:id/read
    const id = Number(parts[1]);
    if (!Number.isInteger(id)) return error(400, "id must be an integer");

    if (parts.length === 2 && req.method === "GET") {
      const book = store.get(id);
      return book ? json(book) : error(404, "book not found");
    }

    if (parts.length === 3 && parts[2] === "read" && req.method === "POST") {
      const book = store.markRead(id);
      return book ? json(book) : error(404, "book not found");
    }

    return error(404, "not found");
  };
}
