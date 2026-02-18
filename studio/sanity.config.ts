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
            S.listItem()
              .title('Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteConfig')
                  .documentId('siteConfig')
                  .title('Global Settings')
              ),
            S.listItem()
              .title('Home Page Editor')
              .id('homePageEditor')
              .child(
                S.document()
                  .schemaType('homePage')
                  .documentId('homePage')
                  .title('Home Page Editor')
              ),
            S.divider(),
            S.documentTypeListItem('post').title('Posts'),
            S.documentTypeListItem('person').title('People'),
            S.documentTypeListItem('category').title('Categories'),
            S.documentTypeListItem('location').title('Locations'),
            S.documentTypeListItem('page').title('Generic Pages'),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem) => !['post', 'person', 'category', 'location', 'page', 'siteConfig', 'homePage'].includes(listItem.getId() || '')
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
