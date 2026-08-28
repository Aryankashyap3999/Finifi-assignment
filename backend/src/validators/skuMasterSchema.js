import { z } from 'zod';

export const createSkuMasterSchema = z.object({
  skuErpCode: z.string().min(1),
  name: z.string().min(1),
  eanCode: z.string().optional(),
  hsnCode: z.string().optional(),
  uom: z.string().optional(),
  agreedRate: z.number().nonnegative().optional(),
  mrp: z.number().nonnegative().optional(),
  priceTolerance: z.number().min(0).max(1).optional()
});

export const updateSkuMasterSchema = createSkuMasterSchema.partial();
