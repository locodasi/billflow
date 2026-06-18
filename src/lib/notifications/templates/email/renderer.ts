// src/lib/notifications/templates/email/renderer.ts

import { render } from "@react-email/components";
import type { ReactElement } from "react";
import type { EmailPayload, EmailRecipient } from "../../types";

interface RenderEmailOptions {
  recipient: EmailRecipient;
  subject: string;
  component: ReactElement;
}

export async function renderEmail({
  recipient,
  subject,
  component,
}: RenderEmailOptions): Promise<EmailPayload> {
  const html = await render(component);

  return {
    channel: "email",
    recipient,
    subject,
    body: html,
  };
}