import { defineType, defineField } from 'sanity'

export const PROGRAM_BUCKETS = [
  { value: 'news', title: 'News & Current Affairs' },
  { value: 'talk', title: 'Talk Shows' },
  { value: 'cultural', title: 'Cultural & Historical' },
  { value: 'human-rights', title: 'Human Rights' },
  { value: 'sport', title: 'Sport' },
  { value: 'amsterdam', title: 'Amsterdam Studio' },
  { value: 'london', title: 'London Studio' },
  { value: 'archives', title: 'Archives' },
]

export const program = defineType({
  name: 'program',
  title: 'Program',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'titleAm', title: 'Title (Amharic)', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'bucket', type: 'string', options: { list: PROGRAM_BUCKETS }, validation: r => r.required() }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
    defineField({ name: 'descriptionAm', title: 'Description (Amharic)', type: 'text', rows: 3 }),
    defineField({ name: 'thumbnail', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'youtubePlaylistId', title: 'YouTube Playlist ID', type: 'string' }),
    defineField({ name: 'active', type: 'boolean', initialValue: true }),
  ],
})
