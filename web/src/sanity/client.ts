import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "22t68kfp",
  dataset: "production",
  apiVersion: "2024-02-18",
  useCdn: false,
  // Enable stega for Visual Editing
  stega: {
    enabled: process.env.NEXT_PUBLIC_VERCEL_ENV === "preview",
    studioUrl: "http://localhost:3333", // Update this if your studio is deployed
  },
});
