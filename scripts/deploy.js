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
    exec(`mkdir -p "${destDir}"`);
    
    // Build the package
    console.log(`Building ${pkg} package...`);
    if (pkg === 'db') {
      // Install prisma dependencies in the backend
      exec('pnpm add @prisma/client@6.12.0', backendPath);
      exec('pnpm add -D prisma@6.12.0', backendPath);
      
      // Generate Prisma client in the backend's node_modules
      exec('pnpm prisma generate', pkgDir);
      
      // Copy the prisma schema and migrations to backend
      const prismaDir = path.join(pkgDir, 'prisma');
      const backendPrismaDir = path.join(backendPath, 'prisma');
      exec(`mkdir -p "${backendPrismaDir}"`);
      exec(`cp -r "${prismaDir}/." "${backendPrismaDir}/"`);
    }
    
    exec('pnpm build', pkgDir);
    
    // Copy the entire dist directory
    const distDir = path.join(pkgDir, 'dist');
    if (fs.existsSync(distDir)) {
      exec(`cp -r "${distDir}" "${destDir}/"`);
    }
    
    // Copy package.json and other necessary files
    const filesToCopy = ['package.json', 'README.md'];
    for (const file of filesToCopy) {
      const sourcePath = path.join(pkgDir, file);
      if (fs.existsSync(sourcePath)) {
        exec(`cp "${sourcePath}" "${destDir}/"`);
      }
    }
  }
  
  // Install production dependencies in backend
  console.log('Installing backend production dependencies...');
  exec('pnpm install --prod', backendPath);

  // Install production dependencies in backend
  console.log('Installing backend production dependencies...');
  exec('pnpm install --prod', backendPath);

  console.log('Deployment build completed successfully!');
}

deploy().catch(console.error);