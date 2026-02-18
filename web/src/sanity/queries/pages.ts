import { defineQuery } from "next-sanity";

export const HOME_PAGE_QUERY = defineQuery(/* groq */ `
  *[_id == "homePage"][0] {
    title,
    sections[] {
      _type,
      _key,
      _type == "hero" => {
        title,
        subtitle,
        "imageUrl": image.asset->url
      },
      _type == "moodPicker" => {
        title,
        subtitle
      },
      _type == "featuredPosts" => {
        title,
        count
      },
      _type == "textContent" => {
        heading,
        content,
        align
      }
    },
    seo
  }
`);

export const PAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "page" && slug.current == $slug][0] {
    title,
    body,
    "imageUrl": mainImage.asset->url
  }
`);
