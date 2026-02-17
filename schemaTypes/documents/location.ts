import {defineField, defineType} from 'sanity'
import {PinIcon} from '@sanity/icons'

export const location = defineType({
  name: 'location',
  title: 'Location',
  type: 'document',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        defineField({name: 'street', type: 'string', title: 'Street'}),
        defineField({name: 'city', type: 'string', title: 'City'}),
        defineField({name: 'state', type: 'string', title: 'State'}),
        defineField({name: 'zip', type: 'string', title: 'Zip Code'}),
      ],
    }),
    defineField({
      name: 'geolocation',
      title: 'Geolocation',
      type: 'geopoint',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
})
