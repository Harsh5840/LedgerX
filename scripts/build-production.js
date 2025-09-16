const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Execute command and log output
function exec(command, cwd = process.cwd()) {
  console.log(`Executing: ${command}`);
  execSync(command, { cwd, stdio: 'inherit' });
}

// Main build function
async function buildForProduction() {
  // Clean previous builds
  exec('rm -rf node_modules');
  exec('rm -rf packages/*/node_modules packages/*/dist');
  exec('rm -rf apps/ledgerX-backend/node_modules apps/ledgerX-backend/dist');

  // Install dependencies
  exec('pnpm install');

  // Build packages in order
  const packages = ['core', 'db', 'ai'];
  for (const pkg of packages) {
    exec('pnpm build', path.join(process.cwd(), 'packages', pkg));
  }

  // Build backend
  exec('pnpm build', path.join(process.cwd(), 'apps/ledgerX-backend'));

  // Create production package.json for backend
  const backendPkg = require('../apps/ledgerX-backend/package.json');
  
  // Convert workspace dependencies to actual versions
  for (const dep in backendPkg.dependencies) {
    if (backendPkg.dependencies[dep] === 'workspace:*') {
      const pkgName = dep.split('/')[1];
      const pkgPath = path.join(process.cwd(), 'packages', pkgName, 'package.json');
      const { version } = require(pkgPath);
      backendPkg.dependencies[dep] = version;
    }
  }

  // Write production package.json
  fs.writeFileSync(
    path.join(process.cwd(), 'apps/ledgerX-backend/dist/package.json'),
    JSON.stringify(backendPkg, null, 2)
  );

  // Copy built packages to backend's node_modules
  for (const pkg of packages) {
    const srcDir = path.join(process.cwd(), 'packages', pkg, 'dist');
    const destDir = path.join(process.cwd(), 'apps/ledgerX-backend/node_modules', '@ledgerX', pkg);
    exec(`mkdir -p "${destDir}"`);
    exec(`cp -r "${srcDir}/"* "${destDir}/"`);
  }

  console.log('Production build completed successfully!');
}

buildForProduction().catch(console.error);