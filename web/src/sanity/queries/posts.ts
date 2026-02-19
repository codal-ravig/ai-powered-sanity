import { defineQuery } from "next-sanity";

export const INITIAL_POSTS_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current)] | order(coalesce(views, 0) desc, publishedAt desc, _id desc)[0...12] {
    _id,
    title,
    slug,
    publishedAt,
    views,
    "author": author->{_id, name, slug, "image": image.asset->url, imageUrl},
    "location": location->{_id, name, slug, "image": image.asset->url, imageUrl},
    "mainImage": mainImage.asset->url,
    imageUrl,
    "categories": categories[]->{_id, title, "slug": slug.current},
    "mood": mood->{_id, title, slug, "colorStart": colorStart.hex, "colorEnd": colorEnd.hex}
  }
`);

export const POST_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    "author": author->{_id, name, slug, "image": image.asset->url, imageUrl},
    "location": location->{_id, name, slug, "image": image.asset->url, imageUrl},
    "mainImage": mainImage.asset->url,
    imageUrl,
    "categories": categories[]->{_id, title, "slug": slug.current},
    "mood": mood->{_id, title, "colorStart": colorStart.hex, "colorEnd": colorEnd.hex},
    body[] {
      ...,
      _type == "image" => {
        ...,
        "asset": asset-> {
          _id,
          url,
          metadata {
            lqip,
            dimensions
          }
        }
      }
    },
    views
  }
`);

export const SIMILAR_POSTS_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && slug.current != $slug && (
    author._ref == $authorId || 
    location._ref == $locationId || 
    count(categories[@._ref in $categoryIds]) > 0
  )] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    publishedAt,
    "mainImage": mainImage.asset->url,
    imageUrl,
    "mood": mood->{_id, title, "colorStart": colorStart.hex, "colorEnd": colorEnd.hex}
  }
`);
