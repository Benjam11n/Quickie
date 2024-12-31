declare module 'resend' {
  export class Resend {
    constructor(apiKey: string);

    emails: {
      send(options: {
        from: string;
        to: string | string[];
        subject: string;
        html?: string;
        text?: string;
        reply_to?: string;
      }): Promise<{ id: string }>;
    };
  }
}
