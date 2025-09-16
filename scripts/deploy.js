const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function exec(command, cwd = process.cwd()) {
  console.log(`Executing: ${command}`);
  try {
    execSync(command, { cwd, stdio: 'inherit' });
  } catch (error) {
    // If it's not a copy error of the same file, rethrow
    if (!error.message?.includes("are the same file")) {
      throw error;
    }
    console.log('Skipping copy of identical file');
  }
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
    const pkgDir = path.join(root, 'packages', pkg);
    const destDir = path.join(backendPath, 'node_modules', '@ledgerX', pkg);
    
    // Ensure clean destination
    exec(`rm -rf "${destDir}"`);
    exec(`mkdir -p "${destDir}/dist/src"`);
    
    // Copy dist contents
    const distSrcDir = path.join(pkgDir, 'dist', 'src');
    const distDir = path.join(pkgDir, 'dist');
    
    if (fs.existsSync(distSrcDir)) {
      exec(`cp -r "${distSrcDir}/." "${destDir}/dist/src/"`);
    }
    
    // Copy root dist files (index.js, etc.)
    const distFiles = fs.readdirSync(distDir).filter(f => !f.startsWith('src'));
    for (const file of distFiles) {
      exec(`cp "${path.join(distDir, file)}" "${path.join(destDir, 'dist', file)}"`);
    }
    
    // Copy package.json
    const pkgJson = path.join(pkgDir, 'package.json');
    if (fs.existsSync(pkgJson)) {
      exec(`cp "${pkgJson}" "${destDir}/package.json"`);
    }
  }

  // Install production dependencies in backend
  console.log('Installing backend production dependencies...');
  exec('pnpm install --prod', backendPath);

  console.log('Deployment build completed successfully!');
}

deploy().catch(console.error);