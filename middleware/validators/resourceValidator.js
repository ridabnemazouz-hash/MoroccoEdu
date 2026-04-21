const { z } = require('zod');

exports.uploadResourceSchema = z.object({
  params: z.object({
    moduleId: z.string().or(z.number())
  }),
  body: z.object({
    type: z.enum(['pdf', 'video', 'image', 'note']),
    title: z.string().min(3).max(255).trim(),
    description: z.string().max(5000).optional().default('')
  })
});

exports.getResourceSchema = z.object({
  params: z.object({
    resourceId: z.string().or(z.number())
  })
});

exports.getResourcesSchema = z.object({
  params: z.object({
    moduleId: z.string().or(z.number())
  }),
  query: z.object({
    limit: z.string().or(z.number()).optional(),
    offset: z.string().or(z.number()).optional()
  })
});
