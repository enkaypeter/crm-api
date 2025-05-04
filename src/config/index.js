import dotenv from "dotenv";
dotenv.config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  permit: {
    apiKey: process.env.PERMIT_API_KEY,
    projectId: process.env.PERMIT_PROJECT_ID,
    envId: process.env.PERMIT_ENV_ID,
    apiBaseUrl: process.env.PERMIT_API_URL || "https://api.permit.io",
    pdpUrl: process.env.PERMIT_PDP_URL || "https://cloudpdp.api.permit.io",
  },
};

export default config;
