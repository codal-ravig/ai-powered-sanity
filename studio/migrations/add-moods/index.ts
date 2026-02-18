import { defineMigration, patch, set, at } from '@sanity/migrate'

const MOODS = [
  'mood-comfort',
  'mood-celebration',
  'mood-morning',
  'mood-midnight'
];

export default defineMigration({
  title: 'Add random moods to all posts',
  documentTypes: ['post'],

  migrate: {
    document(doc, context) {
      if (doc.mood) return
      
      const randomMood = MOODS[Math.floor(Math.random() * MOODS.length)];
      
      return patch(doc._id, [
        at('mood', set({
          _type: 'reference',
          _ref: randomMood
        }))
      ]);
    }
  }
})
