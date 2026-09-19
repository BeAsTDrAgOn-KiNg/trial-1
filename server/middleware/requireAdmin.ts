import { requireRole } from './requireRole';

// Kept as a compatibility export for routes that still import requireAdmin.
export const requireAdmin = requireRole(['Admin']);
