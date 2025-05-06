import { z } from "zod";

/**
 * Schema for validating query parameters for listing servers
 */
export const ServerListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  q: z.string().optional(),
});

export type ServerListQuery = z.infer<typeof ServerListQuerySchema>;

/**
 * Schema for validating the create server request payload
 */
export const CreateServerSchema = z
  .object({
    id: z.string().regex(/^\d+$/, "Server ID must contain only digits"),
    name: z.string().min(1, "Server name is required"),
    iconUrl: z.string().url("Invalid icon URL").optional(),
    config: z.record(z.any()).optional(),
  })
  .transform((data) => ({
    ...data,
    id: data.id, // Keep as string for the API, service will handle it appropriately
  }));

export type CreateServerRequest = z.infer<typeof CreateServerSchema>;

/**
 * Schema for validating the update server request payload
 */
export const UpdateServerSchema = z.object({
  name: z.string().min(1, "Server name must not be empty").optional(),
  iconUrl: z.string().url("Invalid icon URL").nullable().optional(),
  config: z.record(z.any()).optional(),
  active: z.boolean().optional(),
});

export type UpdateServerRequest = z.infer<typeof UpdateServerSchema>;
