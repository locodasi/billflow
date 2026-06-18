export type NotificationChannel = "email" | "whatsapp" | "internal";

// ---------- Recipients ----------
export interface EmailRecipient {
    name: string;
    email: string;
}

export interface WhatsAppRecipient {
    name: string;
    phone: string;
}

export interface InternalRecipient {
    userId: string;
    name?: string;
}

// ---------- Payloads por canal ----------
// Estos son los objetos que recibe cada Strategy, ya listos para enviar

export interface EmailPayload {
    channel: "email";
    recipient: EmailRecipient;
    subject: string;
    body: string; // HTML final, ya con layout aplicado
}

export interface WhatsAppPayload {
    channel: "whatsapp";
    recipient: WhatsAppRecipient;
    body: string; // Texto plano final
}

export interface InternalPayload {
    channel: "internal";
    recipient: InternalRecipient;
    title: string;
    body: string;
    actionUrl?: string;
    metadata?: Record<string, unknown>;
}

export type NotificationPayload = EmailPayload | WhatsAppPayload | InternalPayload;

// ---------- Result ----------
export interface NotificationResult {
    success: boolean;
    channel: NotificationChannel;
    messageId?: string;
    error?: string;
}