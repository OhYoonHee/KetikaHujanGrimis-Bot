// Import package
import "https://deno.land/x/dotenv@v3.1.0/load.ts";

// Get the env variable as Object
const env = Deno.env.toObject();

// Export env variable
export default env;
export { env };