import { z } from "zod";

const hexColor = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "Use #RGB, #RRGGBB, or #RRGGBBAA");

export const createCustomerSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: lowercase letters, numbers, hyphens")
    .optional(),
  darkColor: hexColor.default("#0f172a"),
  lightColor: hexColor.default("#ffffff"),
});

export const qrRequestSchema = z
  .object({
    content: z.string().min(1).max(4096),
    darkColor: hexColor.optional(),
    lightColor: hexColor.optional(),
    width: z.number().int().min(128).max(2048).optional(),
    errorCorrectionLevel: z.enum(["L", "M", "Q", "H"]).optional(),
    format: z.enum(["png", "svg"]).default("png"),
    customerId: z.string().cuid().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.customerId) return;
    if (!val.darkColor) {
      ctx.addIssue({
        code: "custom",
        message: "darkColor is required when customerId is omitted",
        path: ["darkColor"],
      });
    }
    if (!val.lightColor) {
      ctx.addIssue({
        code: "custom",
        message: "lightColor is required when customerId is omitted",
        path: ["lightColor"],
      });
    }
  });

export const updateCustomerSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  darkColor: hexColor.optional(),
  lightColor: hexColor.optional(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type QrRequestInput = z.infer<typeof qrRequestSchema>;
