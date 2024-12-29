declare global {
  interface UpdateAccountParams {
    userId: string;
    oldPassword: string;
    newPassword: string;
  }
}

export {};
