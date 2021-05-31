const path = require('path');
const fs = require('fs');

// Find each resource and build a path map of them
const rootOutputPath = path.resolve(process.cwd(), 'resources');
const rootSourcePath = path.resolve(process.cwd(), 'src');

const categoryExp = /^\[[\s\S]+\]$/;

const resourceMap = {
  output: rootOutputPath,
  source: rootSourcePath,
  resourceInfo: {},
  resources: [],
};

findLatestModified = (dirPath, latest) => {
  const contained = fs.readdirSync(dirPath);

  contained.forEach((item) => {
    const itemPath = path.resolve(dirPath, item);
    
    const stats = fs.statSync(itemPath);

    // If item has been modified at a more recent date than latest, replace
    if (stats.mtime > latest) {
      latest = stats.mtime;
    }

    // If item is a directory explore it
    if (stats.isDirectory()) {
      latest = findLatestModified(itemPath, latest);
    }
  });

  return latest;
}

isTypescriptResource = (resourcePath, indictorFileRegex) => {
  const items = fs.readdirSync(resourcePath);
  const scriptDirs = [];

  items.forEach((item) => {
    // Check if it's a dir or not
    const itemPath = path.resolve(resourcePath, item);

    const stats = fs.statSync(itemPath);

    if(stats.isDirectory()) {
      const files = fs.readdirSync(itemPath);

      if (files.some((file) => indictorFileRegex.test(file))) {
        scriptDirs.push(item);
      }
    }
  });

  return scriptDirs;
}

scanDir = (dirPath, resourceMap) => {
  // Find the contained files and directories
  const contained = fs.readdirSync(dirPath);

  contained.forEach((item) => {
    const itemPath = path.resolve(dirPath, item);
    const isCategory = categoryExp.test(item);
    
    // If it is a category, recursively scan until you find the resource directories
    if(isCategory) {
      scanDir(itemPath, resourceMap);
    } else {
      // Look up all the information about the scan
      const stats = fs.statSync(itemPath);
      const lastModified = findLatestModified(itemPath, stats.mtime);

      // Get the relative path
      const relItemPath = path.relative(resourceMap.source, itemPath);

      // Check to see if it was built and if so when
      const outputItemPath = path.resolve(resourceMap.output, relItemPath);
      const exists = fs.existsSync(outputItemPath);
      let lastBuilt = null;

      if (exists) {
        const outputStats = fs.statSync(outputItemPath);
        lastBuilt = findLatestModified(outputItemPath, outputStats.mtime);
      }

      // Compile all known information so far
      const info = {
        relativePath: relItemPath,
        lastModified,
        lastBuilt,
      };

      // Check to see if there's typescript scripts to compile and where
      const tsRegExp = /^index\.(ts|tsx)$/;
      const scriptDirs = isTypescriptResource(itemPath, tsRegExp);

      // Add the script dirs that are known
      info.tsCompile = scriptDirs;

      resourceMap.resources.push(item);
      resourceMap.resourceInfo[item] = info;
    }
  });
}

scanDir(rootSourcePath, resourceMap);

module.exports = resourceMap;