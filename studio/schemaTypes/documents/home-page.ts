import { defineField, defineType } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Home Page',
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: [
        {
          name: 'hero',
          type: 'object',
          title: 'Hero Section',
          fields: [
            { name: 'title', type: 'string', title: 'Main Heading' },
            { name: 'subtitle', type: 'text', title: 'Subheading', rows: 2 },
            { name: 'image', type: 'image', title: 'Hero Background', options: { hotspot: true } },
          ],
        },
        {
          name: 'moodPicker',
          type: 'object',
          title: 'Mood Picker Section',
          fields: [
            { name: 'title', type: 'string', title: 'Section Heading', initialValue: 'How are you feeling?' },
            { name: 'subtitle', type: 'string', title: 'Section Subheading', initialValue: 'Choose a mood to explore our stories.' },
          ],
        },
        {
          name: 'featuredPosts',
          type: 'object',
          title: 'Featured Posts Section',
          fields: [
            { name: 'title', type: 'string', title: 'Section Heading', initialValue: 'Fresh from the oven' },
            { name: 'count', type: 'number', title: 'Number of posts to show', initialValue: 12 },
          ],
        },
        {
          name: 'textContent',
          type: 'object',
          title: 'Static Text Block',
          fields: [
            { name: 'heading', type: 'string', title: 'Heading' },
            { name: 'content', type: 'blockContent', title: 'Content' },
            { name: 'align', type: 'string', title: 'Alignment', options: { list: ['left', 'center', 'right'] }, initialValue: 'left' },
          ]
        }
      ],
    }),
    defineField({
        name: 'seo',
        title: 'SEO Settings',
        type: 'object',
        fields: [
            { name: 'metaTitle', type: 'string', title: 'Meta Title' },
            { name: 'metaDescription', type: 'text', title: 'Meta Description', rows: 3 },
        ]
    })
  ],
})
