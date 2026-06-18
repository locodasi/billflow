// src/lib/notifications/strategies/whatsapp.strategy.ts

import type { WhatsAppPayload, NotificationResult } from "../types";
import { BaseNotificationStrategy } from "./base.strategy";

export class WhatsAppStrategy extends BaseNotificationStrategy<WhatsAppPayload> {
  readonly channel = "whatsapp" as const;

  async send(payload: WhatsAppPayload): Promise<NotificationResult> {
    // TODO: Twilio / Meta Cloud API
    throw new Error("WhatsApp strategy not implemented yet");
  }
}