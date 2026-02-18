import {createClient} from '@sanity/client'
import {basename} from 'path'
import {createReadStream} from 'fs'

const client = createClient({
  projectId: '22t68kfp',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-02-17',
  token: process.env.SANITY_API_TOKEN,
})

async function uploadImage(filePath: string) {
  console.log(`Uploading ${filePath}...`)
  try {
    const asset = await client.assets.upload('image', createReadStream(filePath), {
      filename: basename(filePath)
    })
    return asset._id
  } catch (err: any) {
    console.error(`Failed to upload ${filePath}:`, err.message)
    return null
  }
}

async function seed() {
  const img1 = await uploadImage('image1.jpg')
  const img2 = await uploadImage('image2.jpg')
  const img3 = await uploadImage('image3.jpg')
  
  const images = [img1, img2, img3].filter(Boolean) as string[]
  
  const categories = [
    {_id: 'cat-cakes', _type: 'category', title: 'Cakes', slug: {current: 'cakes'}, description: 'Delicious cakes for all occasions.'},
    {_id: 'cat-cookies', _type: 'category', title: 'Cookies', slug: {current: 'cookies'}, description: 'Crunchy and chewy cookies.'},
    {_id: 'cat-sandwiches', _type: 'category', title: 'Sandwiches', slug: {current: 'sandwiches'}, description: 'Freshly made sandwiches.'},
  ]

  const people = [
    {_id: 'person-bob', _type: 'person', name: 'Bob Baker', slug: {current: 'bob-baker'}, image: images[0] ? {asset: {_type: 'reference', _ref: images[0]}, hotspot: true} : undefined, bio: [{_key: 'b1', _type: 'block', children: [{_key: 's1', _type: 'span', text: 'Head baker with 20 years of experience in traditional French pastry.'}], style: 'normal'}]},
    {_id: 'person-alice', _type: 'person', name: 'Alice Icing', slug: {current: 'alice-icing'}, image: images[1] ? {asset: {_type: 'reference', _ref: images[1]}, hotspot: true} : undefined, bio: [{_key: 'b1', _type: 'block', children: [{_key: 's1', _type: 'span', text: 'Pastry chef extraordinaire specializing in intricate wedding cake designs and sugar art.'}], style: 'normal'}]},
  ]

  const locations = [
    {
        _id: 'loc-east', 
        _type: 'location', 
        name: 'East Side Bakery', 
        slug: {current: 'east-side'}, 
        address: {street: '456 East Ave', city: 'Bakeville', state: 'CA', zip: '90211'}, 
        image: images[2] ? {asset: {_type: 'reference', _ref: images[2]}, hotspot: true} : undefined,
        geolocation: {lat: 34.0522, lng: -118.2437},
        description: [{_key: 'd1', _type: 'block', children: [{_key: 's1', _type: 'span', text: 'Our original flagship store in the heart of the East Side arts district.'}], style: 'normal'}]
    },
    {
        _id: 'loc-west', 
        _type: 'location', 
        name: 'West Side Bakery', 
        slug: {current: 'west-side'}, 
        address: {street: '789 West Blvd', city: 'Bakeville', state: 'CA', zip: '90212'}, 
        image: images[0] ? {asset: {_type: 'reference', _ref: images[0]}, hotspot: true} : undefined,
        geolocation: {lat: 34.0195, lng: -118.4912},
        description: [{_key: 'd1', _type: 'block', children: [{_key: 's1', _type: 'span', text: 'A cozy seaside spot featuring beach-inspired treats and custom orders.'}], style: 'normal'}]
    },
  ]

  const titles = [
    "The Art of Layer Cakes", "Secret Cookie Dough Tips", "The Ultimate Sandwich Sourdough",
    "Wedding Cake Trends 2026", "Chocolate Chip Masterclass", "Lunch Break Specials",
    "Seasonal Fruit Tarts", "Perfecting the Croissant"
  ]

  const posts = titles.map((title, i) => ({
    _id: `post-gen-${i}`,
    _type: 'post',
    title: title,
    slug: {current: title.toLowerCase().replace(/ /g, '-')},
    author: {_type: 'reference', _ref: i % 2 === 0 ? 'person-bob' : 'person-alice'},
    categories: [{_key: `c${i}`, _type: 'reference', _ref: categories[i % 3]._id}],
    location: {_type: 'reference', _ref: i % 2 === 0 ? 'loc-east' : 'loc-west'},
    publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
    mainImage: images[i % images.length] ? {asset: {_type: 'reference', _ref: images[i % images.length]}, hotspot: true} : undefined,
    body: [{_key: 'b1', _type: 'block', children: [{_key: 's1', _type: 'span', text: `Learn the secrets of ${title.toLowerCase()} in this comprehensive guide. We dive deep into the techniques that make our bakery famous.`}], style: 'normal'}]
  }))

  const allDocs = [...categories, ...people, ...locations, ...posts]

  console.log(`Importing ${allDocs.length} documents...`)
  
  let transaction = client.transaction()
  allDocs.forEach(doc => {
    transaction = transaction.createOrReplace(doc)
  })

  try {
    await transaction.commit()
    console.log('Seed successful!')
  } catch (err: any) {
    console.error('Transaction failed:', err.message)
  }
}

seed()
