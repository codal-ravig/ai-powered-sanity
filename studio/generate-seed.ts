import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';

// --- CONFIGURATION ---
const NUM_AUTHORS = 8;
const NUM_POSTS = 60;
const currentDir = import.meta.dirname;
const OUTPUT_FILE = path.join(currentDir, 'generated-seed.ndjson');

// --- BAKERY DATA DICTIONARIES ---
const BAKERY_CATEGORIES = [
  { title: 'Sourdough & Breads', slug: 'breads', desc: 'Artisanal slow-fermented loaves and daily staples.' },
  { title: 'French Pastries', slug: 'pastries', desc: 'Buttery croissants, pains au chocolat, and delicate danishes.' },
  { title: 'Custom Cakes', slug: 'cakes', desc: 'Handcrafted cakes for weddings, birthdays, and celebrations.' },
  { title: 'Cookies & Sweet Treats', slug: 'sweets', desc: 'Small bites, chewy cookies, and seasonal confections.' },
  { title: 'Savory Sandwiches', slug: 'sandwiches', desc: 'Fresh lunch options made with our house-baked bread.' },
  { title: 'Seasonal Specials', slug: 'seasonal', desc: 'Limited time flavors inspired by the current harvest.' }
];

const BAKERY_LOCATIONS = [
  { name: 'The Downtown Hearth', slug: 'downtown', street: '123 Baker St', city: 'Bakeville', lat: 34.0522, lng: -118.2437 },
  { name: 'Westside Waterfront', slug: 'westside', street: '789 Ocean Blvd', city: 'Bakeville', lat: 34.0195, lng: -118.4912 },
  { name: 'The Village Oven', slug: 'village', street: '456 Maple Ave', city: 'Bakeville', lat: 34.0837, lng: -118.3582 }
];

const POST_TOPICS = [
  "How to Master the {item}",
  "The Secret to Our {item}",
  "Why We Love {item}",
  "Behind the Scenes: Making {item}",
  "New Arrival: {item} is here!",
  "Pairing Coffee with {item}"
];

const BAKERY_ITEMS = [
  "Golden Croissant", "Pain au Chocolat", "Almond Bostock", "Sourdough Batard",
  "Rye Miche", "Morning Bun", "Lemon Tart", "Chocolate Ganache Cake",
  "Cardamom Bun", "Focaccia with Rosemary", "Baguette Tradition", "Macaron Set"
];

// --- HELPERS ---
const slugify = (text: string) => 
  text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

const createNDJSON = (data: any[]) => data.map(doc => JSON.stringify(doc)).join('\n') + '\n';

const generatePortableText = (textCount: number = 3, topic: string = "") => {
  return Array.from({ length: textCount }).map((_, i) => ({
    _key: faker.string.nanoid(),
    _type: 'block',
    children: [{ 
        _key: faker.string.nanoid(), 
        _type: 'span', 
        text: i === 0 && topic 
            ? `At our bakery, ${topic} is more than just a recipe—it's a tradition. ${faker.lorem.paragraph()}` 
            : faker.lorem.paragraph() 
    }],
    style: i === 0 ? 'h3' : 'normal'
  }));
};

// --- GENERATION ---
const categories = BAKERY_CATEGORIES.map((cat, i) => ({
  _id: `gen-cat-${i}`,
  _type: 'category',
  title: cat.title,
  slug: { current: cat.slug },
  description: cat.desc
}));

const authors = Array.from({ length: NUM_AUTHORS }).map((_, i) => {
  const name = faker.person.fullName();
  return {
    _id: `gen-author-${i}`,
    _type: 'person',
    name,
    slug: { current: slugify(name) },
    bio: generatePortableText(1),
    // Use plain string for external URL to avoid Sanity asset reference errors
    imageUrl: `https://picsum.photos/seed/${slugify(name)}/400/400`
  };
});

const locations = BAKERY_LOCATIONS.map((loc, i) => ({
  _id: `gen-loc-${i}`,
  _type: 'location',
  name: loc.name,
  slug: { current: loc.slug },
  address: {
    street: loc.street,
    city: loc.city,
    state: 'CA',
    zip: faker.location.zipCode('#####')
  },
  geolocation: {
    lat: loc.lat,
    lng: loc.lng
  },
  description: generatePortableText(1),
  imageUrl: `https://picsum.photos/seed/${loc.slug}/800/600`
}));

const posts = Array.from({ length: NUM_POSTS }).map((_, i) => {
  const item = faker.helpers.arrayElement(BAKERY_ITEMS);
  const topicTemplate = faker.helpers.arrayElement(POST_TOPICS);
  const title = topicTemplate.replace('{item}', item);
  
  const author = faker.helpers.arrayElement(authors);
  const location = faker.helpers.arrayElement(locations);
  const selectedCategories = faker.helpers.arrayElements(categories, { min: 1, max: 2 });
  
  return {
    _id: `gen-post-${i}`,
    _type: 'post',
    title,
    slug: { current: slugify(title) + '-' + i },
    publishedAt: faker.date.recent({ days: 90 }).toISOString(),
    author: { _type: 'reference', _ref: author._id },
    location: { _type: 'reference', _ref: location._id },
    categories: selectedCategories.map(cat => ({
      _key: faker.string.nanoid(),
      _type: 'reference',
      _ref: cat._id
    })),
    imageUrl: `https://picsum.photos/seed/post-${i}/1200/800`,
    body: generatePortableText(faker.number.int({ min: 3, max: 5 }), title)
  };
});

// --- EXECUTION ---
const allDocs = [...categories, ...authors, ...locations, ...posts];
fs.writeFileSync(OUTPUT_FILE, createNDJSON(allDocs));

console.log(`✅ Bakery-themed data generated: ${allDocs.length} documents.`);
console.log(`📁 File: ${OUTPUT_FILE}`);
console.log(`✨ Using 'imageUrl' string fields for external Picsum URLs.`);
