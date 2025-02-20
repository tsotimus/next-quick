declare namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_URL: string;
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
      CLERK_SECRET_KEY: string;
      NEXT_PUBLIC_CLERK_SIGN_IN_URL: string;
      MONGODB_URI: string;
    }
  }