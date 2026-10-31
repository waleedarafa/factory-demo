import { describe, expect, test } from "bun:test";
import { createApp } from "../src/server";

const call = (app: ReturnType<typeof createApp>, method: string, path: string, body?: unknown) =>
  app(
    new Request(`http://test${path}`, {
      method,
      headers: body === undefined ? undefined : { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  );

describe("books API", () => {
  test("adds a book and returns it with an id", async () => {
    const app = createApp();
    const res = await call(app, "POST", "/books", { title: "Dune", author: "Frank Herbert" });
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ id: 1, title: "Dune", author: "Frank Herbert", read: false });
  });

  test("lists books in the order they were added", async () => {
    const app = createApp();
    await call(app, "POST", "/books", { title: "A", author: "x" });
    await call(app, "POST", "/books", { title: "B", author: "y" });
    const books = (await (await call(app, "GET", "/books")).json()) as { title: string }[];
    expect(books.map((b) => b.title)).toEqual(["A", "B"]);
  });

  test("gets one book by id, and 404s an unknown id", async () => {
    const app = createApp();
    await call(app, "POST", "/books", { title: "Dune", author: "Frank Herbert" });
    expect((await call(app, "GET", "/books/1")).status).toBe(200);
    expect((await call(app, "GET", "/books/99")).status).toBe(404);
  });

  test("marks a book as read", async () => {
    const app = createApp();
    await call(app, "POST", "/books", { title: "Dune", author: "Frank Herbert" });
    const res = await call(app, "POST", "/books/1/read");
    expect(((await res.json()) as { read: boolean }).read).toBe(true);
  });

  test("rejects a book without a title or author", async () => {
    const app = createApp();
    expect((await call(app, "POST", "/books", { title: "Dune" })).status).toBe(400);
  });

  test("returns at most limit books, in the order they were added", async () => {
    const app = createApp();
    for (const title of ["A", "B", "C"]) await call(app, "POST", "/books", { title, author: "x" });
    const titles = async (path: string) =>
      ((await (await call(app, "GET", path)).json()) as { title: string }[]).map((b) => b.title);
    expect(await titles("/books?limit=2")).toEqual(["A", "B"]);
    expect(await titles("/books?limit=0")).toEqual([]);
  });

  test("rejects a negative limit", async () => {
    const app = createApp();
    expect((await call(app, "GET", "/books?limit=-1")).status).toBe(400);
  });
});
