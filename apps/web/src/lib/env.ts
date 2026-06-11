/** Re-exports for server components/actions. Do not import from middleware (use env-clerk). */

export {
  getClerkDiagnostics,
  getClerkMissingKeys,
  getClerkPublishableKey,
  getClerkSecretKey,
  isClerkConfigured,
  isDevAuthBypass,
} from "@/lib/env-clerk";

export { getDatabaseDiagnostics, isDatabaseConfigured } from "@/lib/env-db";
