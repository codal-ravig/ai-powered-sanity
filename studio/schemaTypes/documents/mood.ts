import { defineField, defineType } from 'sanity'

export const mood = defineType({
  name: 'mood',
  title: 'Mood',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'colorStart',
      title: 'Gradient Start Color',
      type: 'color',
      options: {
        disableAlpha: true
      }
    }),
    defineField({
      name: 'colorEnd',
      title: 'Gradient End Color',
      type: 'color',
      options: {
        disableAlpha: true
      }
    }),
  ],
})
