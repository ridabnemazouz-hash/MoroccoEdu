const { z } = require('zod');

exports.addCommentSchema = z.object({
  params: z.object({
    resourceId: z.string().or(z.number())
  }),
  body: z.object({
    content: z.string().min(1).max(5000).trim(),
    parentId: z.string().or(z.number()).nullable().optional()
  })
});

exports.getCommentsSchema = z.object({
  params: z.object({
    resourceId: z.string().or(z.number())
  })
});

exports.addReactionSchema = z.object({
  params: z.object({
    resourceId: z.string().or(z.number())
  }),
  body: z.object({
    type: z.enum(['like', 'dislike'])
  })
});

exports.trackViewSchema = z.object({
  params: z.object({
    resourceId: z.string().or(z.number())
  })
});
