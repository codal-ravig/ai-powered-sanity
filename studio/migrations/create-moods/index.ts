import { defineMigration } from '@sanity/migrate'

const MOODS = [
  {"_id": "mood-comfort", "_type": "mood", "title": "Comfort", "slug": {"current": "comfort"}, "description": "Warm, cozy, and perfect for a slow rainy afternoon.", "colorStart": "#f59e0b", "colorEnd": "#7c2d12"},
  {"_id": "mood-celebration", "_type": "mood", "title": "Celebration", "slug": {"current": "celebration"}, "description": "Bright, sparkling, and full of joy for special moments.", "colorStart": "#ec4899", "colorEnd": "#701a75"},
  {"_id": "mood-morning", "_type": "mood", "title": "Morning Ritual", "slug": {"current": "morning-ritual"}, "description": "Fresh, energetic, and paired perfectly with your first coffee.", "colorStart": "#06b6d4", "colorEnd": "#1e3a8a"},
  {"_id": "mood-midnight", "_type": "mood", "title": "Midnight Snack", "slug": {"current": "midnight-snack"}, "description": "Decadent, rich, and indulgent for those late-night cravings.", "colorStart": "#6366f1", "colorEnd": "#1e1b4b"}
];

export default defineMigration({
  title: 'Create initial mood documents',
  
  async *migrate(nodes, context) {
    for (const mood of MOODS) {
      yield {
        type: 'createIfNotExists',
        document: mood
      }
    }
  }
})
