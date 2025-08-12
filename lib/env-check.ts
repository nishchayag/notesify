// Environment variables validation for build time
export function validateEnvVars() {
  const requiredEnvVars = [
    'MONGO_URI',
    'NEXTAUTH_SECRET', 
    'RESEND_API_KEY',
    'DOMAIN'
  ];

  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
  
  console.log('✅ All required environment variables are present');
  return true;
}
