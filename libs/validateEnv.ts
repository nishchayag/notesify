// Environment variables validation utility
const requiredEnvVars = [
  "MONGO_URI",
  "NEXTAUTH_SECRET",
  "RESEND_API_KEY",
  "DOMAIN",
];

const optionalEnvVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
];

export function validateEnvironmentVariables() {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  // Check optional variables (warnings only)
  for (const envVar of optionalEnvVars) {
    if (!process.env[envVar]) {
      warnings.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        "Please check your .env file and ensure all required variables are set."
    );
  }

  if (warnings.length > 0 && process.env.NODE_ENV !== "production") {
    console.warn(
      `⚠️  Optional environment variables missing: ${warnings.join(", ")}\n` +
        "Some features (like OAuth) may not work properly."
    );
  }

  return true;
}
