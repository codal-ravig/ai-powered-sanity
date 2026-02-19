import { defineQuery } from "next-sanity";

export const SITE_CONFIG_QUERY = defineQuery(/* groq */ `
  *[_id == "siteConfig"][0] {
    title,
    footerText,
    headerNav[] {
      title,
      linkType,
      externalLink,
      "internalLink": internalLink-> {
        _type,
        "slug": slug.current
      }
    }
  }
`);

export const MOODS_QUERY = defineQuery(/* groq */ `
  *[_type == "mood"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    "colorStart": colorStart.hex,
    "colorEnd": colorEnd.hex
  }
`);

export const LOCATIONS_QUERY = defineQuery(/* groq */ `
  *[_type == "location"] | order(name asc) {
    _id,
    name,
    slug,
    address,
    "image": image.asset->url,
    imageUrl,
    "postCount": count(*[_type == "post" && references(^._id)])
  }
`);

export const LOCATION_QUERY = defineQuery(/* groq */ `
  *[_type == "location" && slug.current == $slug][0] {
    name,
    address,
    geolocation,
    description,
    "image": image.asset->url,
    imageUrl,
    "posts": *[_type == "post" && references(^._id)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      "mainImage": mainImage.asset->url,
      imageUrl
    }
  }
`);

export const CATEGORIES_QUERY = defineQuery(/* groq */ `
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "postCount": count(*[_type == "post" && references(^._id)])
  }
`);

export const CATEGORY_QUERY = defineQuery(/* groq */ `
  *[_type == "category" && slug.current == $slug][0] {
    title,
    description,
    "posts": *[_type == "post" && references(^._id)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      "mainImage": mainImage.asset->url,
      imageUrl
    }
  }
`);

export const AUTHOR_QUERY = defineQuery(/* groq */ `
  *[_type == "person" && slug.current == $slug][0] {
    name,
    bio,
    "image": image.asset->url,
    imageUrl,
    "posts": *[_type == "post" && author._ref == ^._id] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      "mainImage": mainImage.asset->url,
      imageUrl
    }
  }
`);
