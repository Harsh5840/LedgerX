const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function exec(command, cwd = process.cwd()) {
  console.log(`Executing: ${command}`);
  execSync(command, { cwd, stdio: 'inherit' });
}

async function deploy() {
  const root = process.cwd();
  
  // Clean existing builds
  console.log('Cleaning...');
  exec('rm -rf dist node_modules', path.join(root, 'packages/core'));
  exec('rm -rf dist node_modules', path.join(root, 'packages/db'));
  exec('rm -rf dist node_modules', path.join(root, 'packages/ai'));
  exec('rm -rf dist node_modules', path.join(root, 'apps/ledgerX-backend'));

  // Install dependencies
  console.log('Installing dependencies...');
  exec('pnpm install');

  // Build packages in order
  console.log('Building packages...');
  exec('pnpm build', path.join(root, 'packages/core'));
  
  // Generate Prisma client and build db package
  console.log('Generating Prisma client and building db package...');
  const dbPath = path.join(root, 'packages/db');
  exec('pnpm prisma generate', dbPath);
  exec('pnpm build', dbPath);
  
  // Build AI package
  console.log('Building AI package...');
  exec('pnpm build', path.join(root, 'packages/ai'));

  // Build backend
  console.log('Building backend...');
  const backendPath = path.join(root, 'apps/ledgerX-backend');
  exec('pnpm build', backendPath);

  // Create production node_modules structure for backend
  console.log('Setting up production dependencies...');
  
  // Copy package files to backend dist
  const packages = ['core', 'db', 'ai'];
  for (const pkg of packages) {
    const srcDir = path.join(root, 'packages', pkg, 'dist');
    const destDir = path.join(backendPath, 'node_modules', '@ledgerX', pkg);
    
    exec(`mkdir -p "${destDir}"`);
    exec(`cp -r "${srcDir}/." "${destDir}/"`);
    
    // Copy package.json
    const pkgJson = path.join(root, 'packages', pkg, 'package.json');
    exec(`cp "${pkgJson}" "${destDir}/package.json"`);
  }

  // Install production dependencies in backend
  console.log('Installing backend production dependencies...');
  exec('pnpm install --prod', backendPath);

  console.log('Deployment build completed successfully!');
}

deploy().catch(console.error);