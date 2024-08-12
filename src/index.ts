import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import fs from "node:fs";

const app = new Hono();

app.use("/static/*", serveStatic({ root: "/" }));

app.get("/", (c) => {
  return c.html(fs.readFileSync("src/index.html", "utf8"));
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
