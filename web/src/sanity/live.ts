import { defineLive } from "next-sanity/live";
import { client } from "./client";

// Set up the Sanity Live API
export const { sanityFetch, SanityLive } = defineLive({ 
  client,
  serverToken: process.env.SANITY_API_TOKEN,
  browserToken: process.env.SANITY_API_TOKEN,
});
