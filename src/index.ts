import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import fs from "node:fs";

import { generate } from "./llm.js";

const app = new Hono();

app.use("/static/*", serveStatic({ root: "/" }));

app.get("/", (c) => {
  return c.html(fs.readFileSync("src/index.html", "utf8"));
});

app.post("/api/feedback", async (c) => {
  const { feedback } = await c.req.json();
  const response = await generate(feedback);
  console.log({ feedback, response });
  return c.json({ feedback, response });
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
