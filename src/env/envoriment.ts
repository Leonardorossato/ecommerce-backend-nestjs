export {};

// Here we declare the members of the process.env object, so that we
// can use them in our application code in a type-safe manner.
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_PORT: number;
      MONGO_URL: string;
      DEFAULT_AVATAR_URL: string;
      AUTH_MICROSERVICE_URL: string;
      JWT_SECRET: string;
      NODEMAILER_HOST: string;
      NODEMAILER_PORT: number;
      NODEMAILER_USER: string;
      NODEMAILER_PASSWORD: string;
      CLOUDINARY_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string
    }
  }
}
