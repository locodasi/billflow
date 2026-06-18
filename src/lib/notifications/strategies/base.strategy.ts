import type { NotificationPayload, NotificationResult } from "../types";

export abstract class BaseNotificationStrategy<TPayload extends NotificationPayload> {
    abstract readonly channel: string;
    abstract send(payload: TPayload): Promise<NotificationResult>;
}