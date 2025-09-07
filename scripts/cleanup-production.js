#!/usr/bin/env node

/**
 * Production Cleanup Script for LedgerX
 * Removes console.log statements and other development artifacts
 */

const fs = require('fs');
const path = require('path');

const CONSOLE_LOG_PATTERNS = [
  /console\.log\([^)]*\);?\s*\n?/g,
  /console\.warn\([^)]*\);?\s*\n?/g,
  /console\.debug\([^)]*\);?\s*\n?/g,
  // Keep console.error for production error logging
];

const COMMENT_PATTERNS = [
  /\/\/ TODO:.*\n/g,
  /\/\/ FIXME:.*\n/g,
  /\/\/ XXX:.*\n/g,
  /\/\/ HACK:.*\n/g,
];

function cleanupFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Remove console.log statements (but keep console.error)
    CONSOLE_LOG_PATTERNS.forEach(pattern => {
      const newContent = content.replace(pattern, '');
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });

    // Remove TODO comments
    COMMENT_PATTERNS.forEach(pattern => {
      const newContent = content.replace(pattern, '');
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error cleaning ${filePath}:`, error.message);
    return false;
  }
}

function walkDirectory(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  const files = [];
  
  function walk(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and .git directories
        if (!['node_modules', '.git', '.next', 'dist', 'build'].includes(item)) {
          walk(fullPath);
        }
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const files = walkDirectory(projectRoot);
  
  let cleanedCount = 0;
  
  files.forEach(file => {
    if (cleanupFile(file)) {
      cleanedCount++;
    }
  });
  
  if (cleanedCount > 0) {
    }
}

if (require.main === module) {
  main();
}

module.exports = { cleanupFile, walkDirectory };