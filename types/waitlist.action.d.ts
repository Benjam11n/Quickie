declare global {
  interface CreateWaitlistParams {
    email: string;
    name?: string;
  }

  interface GetWaitlistParams {
    email: string;
  }

  interface NotifyWaitlistsParams {
    emails: string[];
  }

  interface VerifyEmailParams {
    token: string;
    email: string;
  }
}

export {};
