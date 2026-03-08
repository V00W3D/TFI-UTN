import { router } from './trpc';
import fs from 'fs';
import path from 'path';

type Procedure = any;

export async function createAutoRouter(modules: string[]) {
  const root: Record<string, any> = {};

  for (const moduleName of modules) {
    const moduleKey = moduleName.toLowerCase();

    const proceduresPath = path.join(process.cwd(), 'apps/backend', moduleName, 'procedures');

    if (!fs.existsSync(proceduresPath)) continue;

    const files = fs.readdirSync(proceduresPath);

    const procedures: Record<string, Procedure> = {};

    for (const file of files) {
      if (!file.endsWith('.ts') && !file.endsWith('.js')) continue;

      const name = file.replace(/\.(ts|js)$/, '');

      const moduleFile = await import(path.join(proceduresPath, file));

      procedures[name] = moduleFile.default;
    }

    root[moduleKey] = router(procedures);
  }

  return router(root);
}
