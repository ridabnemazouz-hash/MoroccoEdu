const { z } = require('zod');

exports.registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).trim(),
    email: z.string().email().toLowerCase().trim(),
    password: z.string().min(8).max(128),
    role: z.enum(['student', 'professor']).optional().default('student')
  })
});

exports.loginSchema = z.object({
  body: z.object({
    email: z.string().email().toLowerCase().trim(),
    password: z.string().min(1).max(128)
  })
});

exports.updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional()
  })
});
