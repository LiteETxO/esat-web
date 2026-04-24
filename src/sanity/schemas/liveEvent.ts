import { defineType, defineField } from 'sanity'

export const liveEvent = defineType({
  name: 'liveEvent',
  title: 'Live Event',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'youtubeStreamId', title: 'YouTube Live Stream ID', type: 'string' }),
    defineField({ name: 'startsAt', type: 'datetime' }),
    defineField({ name: 'endsAt', type: 'datetime' }),
    defineField({ name: 'active', type: 'boolean', initialValue: false }),
  ],
})
