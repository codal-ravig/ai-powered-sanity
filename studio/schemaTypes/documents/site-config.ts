import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const siteConfig = defineType({
  name: 'siteConfig',
  title: 'Site Configuration',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'headerNav',
      title: 'Header Navigation',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'navItem',
          title: 'Navigation Item',
          fields: [
            { name: 'title', type: 'string', title: 'Display Title' },
            {
              name: 'linkType',
              title: 'Link Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Internal Document', value: 'internal' },
                  { title: 'External URL / Path', value: 'external' },
                ],
                layout: 'radio'
              },
              initialValue: 'internal'
            },
            {
              name: 'internalLink',
              type: 'reference',
              title: 'Reference Document',
              description: 'Link to a specific category, location, or page',
              to: [{ type: 'category' }, { type: 'location' }, { type: 'page' }],
              hidden: ({ parent }) => parent?.linkType !== 'internal'
            },
            {
              name: 'externalLink',
              type: 'url',
              title: 'URL or Path',
              description: 'e.g. https://google.com or /categories',
              hidden: ({ parent }) => parent?.linkType !== 'external',
              validation: Rule => Rule.uri({
                scheme: ['http', 'https', 'mailto', 'tel'],
                allowRelative: true
              })
            },
          ],
        },
      ],
    }),
    defineField({
        name: 'footerText',
        title: 'Footer Text',
        type: 'text',
        rows: 2,
    })
  ],
})
