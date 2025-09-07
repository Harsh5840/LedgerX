#!/usr/bin/env node

/**
 * Test Setup Script for LedgerX
 * Adds basic test configuration and sample tests
 */

const fs = require('fs');
const path = require('path');

const JEST_CONFIG = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html']
};

const VITEST_CONFIG = `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html']
    }
  }
});`;

const SAMPLE_TEST = `import { describe, it, expect } from 'vitest';

describe('Sample Test Suite', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle async operations', async () => {
    const result = await Promise.resolve('test');
    expect(result).toBe('test');
  });
});`;

function createTestSetup() {
  // Add test scripts to root package.json
  const rootPackagePath = path.resolve(__dirname, '..', 'package.json');
  const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
  
  rootPackage.scripts = {
    ...rootPackage.scripts,
    'test': 'turbo run test',
    'test:watch': 'turbo run test:watch',
    'test:coverage': 'turbo run test:coverage'
  };

  rootPackage.devDependencies = {
    ...rootPackage.devDependencies,
    'vitest': '^1.0.0',
    '@vitest/coverage-v8': '^1.0.0'
  };

  fs.writeFileSync(rootPackagePath, JSON.stringify(rootPackage, null, 2));
  // Setup tests for each package
  const packagesDir = path.resolve(__dirname, '..', 'packages');
  const packages = fs.readdirSync(packagesDir);

  packages.forEach(pkg => {
    const pkgPath = path.join(packagesDir, pkg);
    const packageJsonPath = path.join(pkgPath, 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Add test scripts
      packageJson.scripts = {
        ...packageJson.scripts,
        'test': 'vitest run',
        'test:watch': 'vitest',
        'test:coverage': 'vitest run --coverage'
      };

      // Add test dependencies
      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        'vitest': '^1.0.0',
        '@vitest/coverage-v8': '^1.0.0'
      };

      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

      // Create vitest config
      const vitestConfigPath = path.join(pkgPath, 'vitest.config.ts');
      fs.writeFileSync(vitestConfigPath, VITEST_CONFIG);

      // Create test directory and sample test
      const testDir = path.join(pkgPath, 'src', '__tests__');
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
      }

      const sampleTestPath = path.join(testDir, 'sample.test.ts');
      fs.writeFileSync(sampleTestPath, SAMPLE_TEST);

      }
  });

  // Setup tests for apps
  const appsDir = path.resolve(__dirname, '..', 'apps');
  if (fs.existsSync(appsDir)) {
    const apps = fs.readdirSync(appsDir);

    apps.forEach(app => {
      const appPath = path.join(appsDir, app);
      const packageJsonPath = path.join(appPath, 'package.json');
      
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        // Add test scripts (different for Next.js apps)
        if (app === 'frontend') {
          packageJson.scripts = {
            ...packageJson.scripts,
            'test': 'vitest run',
            'test:watch': 'vitest',
            'test:coverage': 'vitest run --coverage'
          };
        } else {
          packageJson.scripts = {
            ...packageJson.scripts,
            'test': 'vitest run',
            'test:watch': 'vitest',
            'test:coverage': 'vitest run --coverage'
          };
        }

        packageJson.devDependencies = {
          ...packageJson.devDependencies,
          'vitest': '^1.0.0',
          '@vitest/coverage-v8': '^1.0.0'
        };

        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

        // Create vitest config
        const vitestConfigPath = path.join(appPath, 'vitest.config.ts');
        fs.writeFileSync(vitestConfigPath, VITEST_CONFIG);

        }
    });
  }

  }

if (require.main === module) {
  createTestSetup();
}

module.exports = { createTestSetup };