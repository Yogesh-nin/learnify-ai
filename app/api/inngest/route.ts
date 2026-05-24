import { inngest } from "@/inngest/client";
import { CreateNewUser, GenerateNotes, GenerateStudyTypeContent, helloWorld } from "@/inngest/functions";
import { serve } from "inngest/next";


// Create an API that serves your functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld, CreateNewUser, GenerateNotes, GenerateStudyTypeContent],
});
