import {blockContent} from './blocks/block-content'
import { category } from './documents/category'
import {location} from './documents/location'
import { person } from './documents/person'
import { post } from './documents/post'
import { mood } from './documents/mood'

export const schemaTypes = [post, person, category, blockContent, location, mood]
