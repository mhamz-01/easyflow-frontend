// tasks/validation.ts
import { z } from "zod";

const checklistItemSchema = z.object({
  name: z.string(),
  items: z.array(z.string()),
});

export const createTaskFormSchema = z.object({
  name: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be 255 characters or less"),
  description: z.string().optional().nullable(),
  linkName: z.string().or(z.literal("")).optional(),
  links: z.array(z.string()).optional(),
  documents: z.array(z.number()).optional(),
  checklist: z.array(checklistItemSchema).optional(),
  state: z.string().optional(),
  priority: z.string().optional(),
  assignees: z.array(z.number()).optional(),
  dueDate: z.date().optional(),
  attachments: z.array(z.instanceof(File)).optional(),
  attachedFilesId: z.array(z.number()).optional(),
});

// For API submission - transform to remove attachments
export const createTaskApiSchema = createTaskFormSchema
  .omit({ attachments: true })
  .transform((data) => {
    const { linkName, ...rest } = data; // Remove linkName if not needed in API
    return rest;
  });

export type CreateTaskFormDataType = z.infer<typeof createTaskFormSchema>;
export type CreateTaskApiDataType = z.input<typeof createTaskApiSchema>; // Use z.input instead of z.infer
