import { defineType, defineField } from 'sanity'

export const pressRelease = defineType({
  name: 'pressRelease',
  title: 'Press Release',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'titleAm', title: 'Title (Amharic)', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'publishedAt', type: 'datetime', validation: r => r.required() }),
    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'bodyAm', title: 'Body (Amharic)', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'contactEmail',
      title: 'Press contact email',
      type: 'string',
      description: 'Email address for press inquiries related to this release',
    }),
    defineField({ name: 'attachment', type: 'file', options: { accept: '.pdf' } }),
  ],
  orderings: [{ title: 'Newest first', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
})
