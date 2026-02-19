import { defineLocations, PresentationPluginOptions } from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    post: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Untitled', href: `/posts/${doc?.slug}` },
          { title: 'Home', href: `/` },
        ],
      }),
    }),
    person: defineLocations({
      select: { name: 'name', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.name || 'Untitled', href: `/authors/${doc?.slug}` },
          { title: 'Home', href: `/` },
        ],
      }),
    }),
    category: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Untitled', href: `/categories/${doc?.slug}` },
          { title: 'Home', href: `/` },
        ],
      }),
    }),
    location: defineLocations({
      select: { name: 'name', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.name || 'Untitled', href: `/locations/${doc?.slug}` },
          { title: 'Home', href: `/` },
        ],
      }),
    }),
    page: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Untitled', href: `/${doc?.slug}` },
          { title: 'Home', href: `/` },
        ],
      }),
    }),
  },
}
