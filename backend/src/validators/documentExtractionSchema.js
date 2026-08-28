import { z } from 'zod';

const poExtractionSchema = z.object({
  poNumber: z.string().min(1),
  poDate: z.coerce.date(),
  vendorName: z.string().min(1),
  items: z
    .array(
      z.object({
        itemCode: z.string().min(1),
        description: z.string().min(1),
        quantity: z.coerce.number()
      })
    )
    .min(1)
});

const grnExtractionSchema = z.object({
  grnNumber: z.string().min(1),
  poNumber: z.string().min(1),
  grnDate: z.coerce.date(),
  items: z
    .array(
      z.object({
        itemCode: z.string().min(1),
        description: z.string().min(1),
        receivedQuantity: z.coerce.number(),
        mrp: z.coerce.number().optional()
      })
    )
    .min(1)
});

const invoiceExtractionSchema = z.object({
  invoiceNumber: z.string().min(1),
  poNumber: z.string().min(1),
  invoiceDate: z.coerce.date(),
  items: z
    .array(
      z.object({
        itemCode: z.string().min(1),
        description: z.string().min(1),
        quantity: z.coerce.number(),
        unitRate: z.coerce.number().optional(),
        mrp: z.coerce.number().optional()
      })
    )
    .min(1)
});

const EXTRACTION_SCHEMAS = {
  po: poExtractionSchema,
  grn: grnExtractionSchema,
  invoice: invoiceExtractionSchema
};

export const getExtractionSchemaForType = (documentType) => EXTRACTION_SCHEMAS[documentType];
