const fs = require('node:fs/promises');
const path = require('node:path');

const projectRoot = path.join(__dirname, '..');
const sourceDirectory = path.join(projectRoot, 'frontend');
const publicDirectory = path.join(projectRoot, 'public');

async function copyFrontendToPublic() {
  await fs.mkdir(publicDirectory, { recursive: true });

  const entries = await fs.readdir(sourceDirectory, { withFileTypes: true });
  for (const entry of entries) {
    await fs.cp(
      path.join(sourceDirectory, entry.name),
      path.join(publicDirectory, entry.name),
      { recursive: true, force: true },
    );
  }

  process.stdout.write('Copied frontend assets to Vercel public directory.\n');
}

copyFrontendToPublic().catch((error) => {
  process.stderr.write(`Could not prepare Vercel assets: ${error.message}\n`);
  process.exitCode = 1;
});
