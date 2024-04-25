declare global {
    namespace NodeJS {
        interface ProcessENV {
            MONGODB_URI: string;
            RESEND_API_KEY: string;
            NEXTAUTH_SECRET_KEY: string;
            OPENAI_API_KEY: string;
        }
    }
}
