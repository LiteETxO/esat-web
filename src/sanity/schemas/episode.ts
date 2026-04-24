import { defineType, defineField } from 'sanity'

export const episode = defineType({
  name: 'episode',
  title: 'Episode',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'program', type: 'reference', to: [{ type: 'program' }], validation: r => r.required() }),
    defineField({ name: 'youtubeId', title: 'YouTube Video ID', type: 'string', validation: r => r.required() }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
    defineField({ name: 'thumbnail', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'durationSeconds', title: 'Duration (seconds)', type: 'number' }),
  ],
  preview: {
    select: { title: 'title', program: 'program.title', media: 'thumbnail' },
    prepare({ title, program, media }) {
      return { title, subtitle: program, media }
    },
  },
})
