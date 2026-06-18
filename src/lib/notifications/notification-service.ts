import type { NotificationPayload, NotificationResult } from "./types";
import { EmailStrategy } from "./strategies/email.strategy";
import { WhatsAppStrategy } from "./strategies/whatsapp.strategy";
import { InternalStrategy } from "./strategies/internal.strategy";
import type { BaseNotificationStrategy } from "./strategies/base.strategy";

class NotificationService {
  private strategies: Map<string, BaseNotificationStrategy<NotificationPayload>>;

  constructor() {
    this.strategies = new Map<string, BaseNotificationStrategy<NotificationPayload>>([
      ["email",    new EmailStrategy()],
      ["whatsapp", new WhatsAppStrategy()],
      ["internal", new InternalStrategy()],
    ]);
  }

  // Un solo payload
  async send(payload: NotificationPayload): Promise<NotificationResult> {
    const strategy = this.strategies.get(payload.channel);

    if (!strategy) {
      return {
        success: false,
        channel: payload.channel,
        error: `No strategy registered for channel: ${payload.channel}`,
      };
    }

    return strategy.send(payload);
  }

  // Varios payloads en paralelo, pueden ser de distinto canal
  async sendMultiple(payloads: NotificationPayload[]): Promise<NotificationResult[]> {
    return Promise.all(payloads.map((payload) => this.send(payload)));
  }
}

export const notificationService = new NotificationService();