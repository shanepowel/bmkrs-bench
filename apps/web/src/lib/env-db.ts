import {
  isDatabaseUrlConfigured,
  listConfiguredDatabaseEnvKeys,
  resolveDatabaseEnvKey,
} from "@bench/database/database-url";

export function isDatabaseConfigured(): boolean {
  return isDatabaseUrlConfigured();
}

export function getDatabaseDiagnostics() {
  const keys = listConfiguredDatabaseEnvKeys();
  return {
    configured: isDatabaseUrlConfigured(),
    activeKey: resolveDatabaseEnvKey(),
    keysFound: keys,
  };
}
