import { defineType, defineField } from 'sanity'

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title (English)', type: 'string', validation: r => r.required() }),
    defineField({ name: 'titleAm', title: 'Title (Amharic)', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'author', type: 'reference', to: [{ type: 'author' }] }),
    defineField({ name: 'publishedAt', type: 'datetime', validation: r => r.required() }),
    defineField({ name: 'category', type: 'reference', to: [{ type: 'category' }] }),
    defineField({
      name: 'heroImage',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text', validation: r => r.required() })],
    }),
    defineField({ name: 'excerpt', title: 'Excerpt (English)', type: 'text', rows: 3 }),
    defineField({ name: 'excerptAm', title: 'Excerpt (Amharic)', type: 'text', rows: 3 }),
    defineField({ name: 'body', title: 'Body (English)', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
    defineField({ name: 'bodyAm', title: 'Body (Amharic)', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
    defineField({ name: 'youtubeUrl', title: 'YouTube embed URL', type: 'url' }),
    defineField({ name: 'tags', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'featured', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'title', media: 'heroImage', date: 'publishedAt' },
    prepare({ title, media, date }) {
      return { title, media, subtitle: date ? new Date(date).toLocaleDateString() : '' }
    },
  },
})
