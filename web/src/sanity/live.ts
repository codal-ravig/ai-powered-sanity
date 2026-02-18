import { defineLive } from "next-sanity/live";
import { client } from "./client";

// Set up the Sanity Live API
export const { sanityFetch, SanityLive } = defineLive({ 
  client: client.withConfig({ 
    // Live content requires a token to access drafts and avoid caching issues
    token: process.env.SANITY_API_READ_TOKEN,
  }) 
});
