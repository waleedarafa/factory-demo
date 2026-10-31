import { createApp } from "./server";

const port = Number(process.env.PORT ?? 3000);
Bun.serve({ port, fetch: createApp() });
console.log(`reading list API on http://localhost:${port}`);
