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
      title: 'Gradient Start Color (Hex)',
      type: 'string',
      description: 'e.g. #FFD700',
      validation: (rule) => rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
        name: 'hex color', // Error message is "Must be a valid hex color"
        invert: false,
      }),
    }),
    defineField({
      name: 'colorEnd',
      title: 'Gradient End Color (Hex)',
      type: 'string',
      description: 'e.g. #FFA500',
      validation: (rule) => rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
        name: 'hex color',
        invert: false,
      }),
    }),
  ],
})
