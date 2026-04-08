const fs = require('fs');
const path = require('path');

const srcFiles = [];
const testFiles = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    if (fullPath.includes('node_modules') || fullPath.includes('dist') || fullPath.includes('prisma\\generated') || fullPath.includes('.cache')) continue;
    
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else {
      if (file.endsWith('.d.ts')) continue;
      
      if (file.endsWith('.test.ts') || file.endsWith('.test.tsx')) {
        testFiles.push(fullPath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        if (!fullPath.includes('\\tests\\')) {
           srcFiles.push(fullPath);
        }
      }
    }
  }
}

walk('apps/backend/src');
walk('apps/frontend/src');
walk('packages/sdk');
walk('packages/contracts');

// Also check all test folders explicitly in case tests are not next to source files
function walkTests(dir) {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkTests(fullPath);
    } else if (file.endsWith('.test.ts') || file.endsWith('.test.tsx')) {
      testFiles.push(fullPath);
    }
  }
}
walkTests('apps/backend/tests');
walkTests('apps/frontend/tests');
walkTests('packages/sdk/tests');
walkTests('packages/contracts/tests');

const testNames = new Set(testFiles.map(t => path.basename(t).replace('.test.ts', '').replace('.test.tsx', '')));

const missing = srcFiles.filter(s => {
  const base = path.basename(s).replace('.ts', '').replace('.tsx', '');
  return !testNames.has(base);
});

console.log('Total Source Files:', srcFiles.length);
console.log('Total Test Files:', testFiles.length);
console.log('Missing tests for:', missing.length, 'files');
console.log(missing.join('\n'));
