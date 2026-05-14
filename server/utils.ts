import { Response } from 'express';

/**
 * Error handling helper
 */
export const sendError = (res: Response, error: any, defaultMessage: string) => {
  console.error(`[API Error] ${defaultMessage}:`, error);
  const message = error instanceof Error ? error.message : defaultMessage;
  res.status(500).json({ error: message, success: false });
};

/**
 * Strips relational fields and immutable fields (id, createdAt) from data
 * to prevent Prisma from throwing validation errors during create/update.
 */
export const sanitizeData = (data: any) => {
  const { 
    id, createdAt, updatedAt, 
    reporter, clinicalEntries, 
    abcRecord, adoptions, cases, usages, 
    medicine, user, ...rest 
  } = data;
  
  const sanitized: any = {};
  
  // Only keep primary types (strings, numbers, booleans, null)
  for (const key in rest) {
    if (rest[key] === null || typeof rest[key] !== 'object') {
      sanitized[key] = rest[key];
    }
  }
  return sanitized;
};
