import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import fs from "node:fs";

import { generate } from "./llm.ts";
import { turso } from "./db.ts";

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

app.post("/api/feedback/save", async (c) => {
  console.log("save feedback");

  const { feedback, eventName, response } = await c.req.json();

  await turso.execute({
    sql: "INSERT INTO feedback (event_name, feedback, response) VALUES (?, ?, ?)",
    args: [eventName, feedback, response],
  });

  return c.json({ status: "saved", feedback, eventName, response });
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
