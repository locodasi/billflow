// src/lib/notifications/strategies/internal.strategy.ts

import type { InternalPayload, NotificationResult } from "../types";
import { BaseNotificationStrategy } from "./base.strategy";

export class InternalStrategy extends BaseNotificationStrategy<InternalPayload> {
  readonly channel = "internal" as const;

  async send(payload: InternalPayload): Promise<NotificationResult> {
    // TODO: INSERT en tabla notifications de Supabase
    // Supabase Realtime se encarga del websocket al cliente
    throw new Error("Internal strategy not implemented yet");
  }
}