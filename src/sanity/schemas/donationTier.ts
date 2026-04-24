import { defineType, defineField } from 'sanity'

export const donationTier = defineType({
  name: 'donationTier',
  title: 'Donation Tier',
  type: 'document',
  fields: [
    defineField({ name: 'amount', type: 'number', validation: r => r.required().positive() }),
    defineField({ name: 'label', title: 'Label (e.g. "Keep one journalist online for a week")', type: 'string', validation: r => r.required() }),
    defineField({ name: 'labelAm', title: 'Label (Amharic)', type: 'string' }),
    defineField({ name: 'highlighted', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', type: 'number' }),
  ],
  orderings: [{ title: 'Amount', name: 'amount', by: [{ field: 'amount', direction: 'asc' }] }],
})
