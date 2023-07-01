import { z } from "zod";

export const SliceValidator = z.object({
  name: z.string().min(3).max(50),
});

export const SliceSubscriptionValidator = z.object({
  sliceId: z.string(),
});

export type CreateSlicePayload = z.infer<typeof SliceValidator>;
export type SubscribeToSlicePayload = z.infer<
  typeof SliceSubscriptionValidator
>;
