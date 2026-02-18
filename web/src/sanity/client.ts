import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "22t68kfp",
  dataset: "production",
  apiVersion: "2024-02-18",
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
});
