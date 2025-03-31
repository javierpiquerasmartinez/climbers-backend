import fs from 'fs/promises';
import path from 'path';

const rootDir = './dist';

async function fixImports(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await fixImports(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      let content = await fs.readFile(fullPath, 'utf8');

      const fixed = content.replace(
        /from\s+['"](\.\/[^'"]+?)(?<!\.js)['"]/g,
        'from "$1.js"'
      );

      if (fixed !== content) {
        await fs.writeFile(fullPath, fixed, 'utf8');
        console.log(`✅ Fixed imports in: ${fullPath}`);
      }
    }
  }
}

await fixImports(rootDir);
