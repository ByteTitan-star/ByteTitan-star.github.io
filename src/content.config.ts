import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const commonSchema = z.object({
  title: z.string(),
  titleEn: z.string().optional(),
  description: z.string(),
  descriptionEn: z.string().optional(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false)
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: commonSchema
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: commonSchema.extend({
    category: z.string().default('General')
  })
});

export const collections = { blog, notes };
