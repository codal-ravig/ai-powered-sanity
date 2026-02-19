import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './schemaTypes'
import {resolve} from './presentation/resolve'
import {colorInput} from '@sanity/color-input'
import {documentListWidget} from 'sanity-plugin-dashboard-widget-document-list'
import {dashboardTool} from '@sanity/dashboard'
const SANITY_STUDIO_PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'

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
                  .title('Global Settings'),
              ),
            S.listItem()
              .title('Home Page Editor')
              .id('homePageEditor')
              .child(
                S.document()
                  .schemaType('homePage')
                  .documentId('homePage')
                  .title('Home Page Editor'),
              ),
            S.divider(),
            S.documentTypeListItem('post').title('Posts'),
            S.documentTypeListItem('person').title('People'),
            S.documentTypeListItem('category').title('Categories'),
            S.documentTypeListItem('location').title('Locations'),
            S.documentTypeListItem('page').title('Generic Pages'),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem) =>
                ![
                  'post',
                  'person',
                  'category',
                  'location',
                  'page',
                  'siteConfig',
                  'homePage',
                ].includes(listItem.getId() || ''),
            ),
          ]),
    }),
    visionTool(),
    colorInput(),
    presentationTool({
      resolve,
      previewUrl: {
        origin: SANITY_STUDIO_PREVIEW_URL,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
    dashboardTool({
      widgets: [
        documentListWidget({
          title: 'Some documents',
          order: '_updatedAt desc',
          types: ['post'],
        }),
         documentListWidget({
          title: 'Others documents',
          order: '_updatedAt desc',
          types: ['category', 'location', 'people'],
        }),
      ],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
