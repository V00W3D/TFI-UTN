import { router } from '../config/trpc/trpc';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import chalk from 'chalk';

let routeTree: string[] = [];

export function printRoutes() {
  console.log('\n' + chalk.bold.cyan('tRPC ROUTES\n'));

  for (const line of routeTree) {
    console.log(line);
  }
}

export async function createAutoRouter(modules: string[]) {
  const root: Record<string, any> = {};
  routeTree = [];

  for (const moduleName of modules) {
    const moduleKey = moduleName.toLowerCase();

    const proceduresPath = path.join(process.cwd(), moduleName, 'procedures');

    if (!fs.existsSync(proceduresPath)) continue;

    const files = fs.readdirSync(proceduresPath);

    const procedures: Record<string, any> = {};

    routeTree.push(chalk.bold.yellow(`📦 ${moduleKey}`));

    for (const file of files) {
      if (!file.endsWith('.js') && !file.endsWith('.ts')) continue;

      const name = file.replace(/\.(ts|js)$/, '');

      const moduleFile = await import(pathToFileURL(path.join(proceduresPath, file)).href);

      if (!moduleFile.default) continue;

      procedures[name] = moduleFile.default;

      routeTree.push(chalk.gray('   └─ ') + chalk.green(`${moduleKey}.${name}`));
    }

    root[moduleKey] = router(procedures);
  }

  return router(root);
}
