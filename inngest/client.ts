import { Inngest } from "inngest";

// Local development should talk to the Inngest dev server, not Inngest Cloud.
const isDev = process.env.NODE_ENV !== "production";

export const inngest = new Inngest({
  id: "ai-lms",
  eventKey: process.env.INNGEST_EVENT_KEY,
  isDev,
});
