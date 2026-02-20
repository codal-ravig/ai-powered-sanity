import { defineLive } from "next-sanity/live";
import { client } from "./client";

// Set up the Sanity Live API
export const { sanityFetch, SanityLive } = defineLive({ 
  client,
  serverToken: process.env.SANITY_API_TOKEN,
  // DO NOT use serverToken as browserToken unless the dataset is private
  // and you have a secure way to distribute the token.
  browserToken: process.env.NEXT_PUBLIC_SANITY_READ_TOKEN,
});
