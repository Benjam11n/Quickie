declare global {
  interface UpdateUserParams {
    userId: string;
    username: string;
    email: string;
    name: string;
    image?: string;
    isPrivate: boolean;
  }
}

export {};
