// src/types/actions.ts
export type ActionResult<T = null> =
    | { success: true; data: T }
    | { success: false; error: { field: string; message: string } }