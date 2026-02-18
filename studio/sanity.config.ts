import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'My Bakery',

  projectId: '22t68kfp',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.documentTypeListItem('post').title('Posts'),
            S.documentTypeListItem('person').title('People'),
            S.documentTypeListItem('category').title('Categories'),
            S.documentTypeListItem('location').title('Locations'),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem) => !['post', 'person', 'category', 'location'].includes(listItem.getId() || '')
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
