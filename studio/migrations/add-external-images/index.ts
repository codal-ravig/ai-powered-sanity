import { defineMigration, patch, set, at } from '@sanity/migrate'

export default defineMigration({
  title: 'Add external image URL to posts',
  documentTypes: ['post'],

  migrate: {
    document(doc, context) {
      if (doc.imageUrl || doc.mainImage) return

      const slug = (doc.slug as any)?.current
      if (!slug) return

      const imageUrl = `https://picsum.photos/seed/${slug}/1200/800`

      return patch(doc._id, [
        at('imageUrl', set(imageUrl))
      ]);
    }
  }
})
