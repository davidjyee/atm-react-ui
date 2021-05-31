const path = require('path');
const fs = require('fs');

const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ResourceConfig = require('./resource.config');
const resourceMap = require('./resourceScan');

ResourceTsxConfig = (options) => ResourceConfig({
  mode: options.mode,
  target: 'web',
  entry: [
    'react-devtools', 
    path.resolve(options.sourcePath, 'index.tsx')
  ],
  output: {
    path: options.outputPath,
    filename: options.outputName,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(options.sourcePath, 'index.html'),
      inject: "body"
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.posix.join(
            path.resolve(options.sourcePath, 'assets').replace(/\\/g, "/"),
            "**"
          ),
          to: path.resolve(options.outputPath, "[name].[ext]"),
        }
      ]
    })
  ],
  resolve: {
    modules: ['node_modules', options.sourcePath],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.react.js']
  }
});

ResourceTsConfig = (options) => ResourceConfig({
  mode: options.mode,
  target: 'node',
  entry: path.resolve(options.sourcePath, 'index.tsx'),
  output: {
    path: options.outputPath,
    filename: options.outputName,
  },
  resolve: {
    modules: ['node_modules', options.sourcePath],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.react.js']
  }
});

copyFolderRecursiveSync = (source, target) => {
  // Check if folder needs to be created or integrated
  const targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder) ) {
    fs.mkdirSync(targetFolder);
  }

  // Copy
  const files = fs.readdirSync(source);

  files.forEach((file) => {
    const curSource = path.join(source, file);
    if (fs.statSync(curSource).isDirectory()) {
      copyFolderRecursiveSync(curSource, targetFolder);
    } else {
      fs.copyFileSync(curSource, targetFolder);
    }
  });
}

console.log(resourceMap);

console.log(`FOUND ${resourceMap.resources.length} RESOURCE(S)`);

// Create a webpack configuration per resource
const configurations = [];

resourceMap.resources.forEach((resourceName) => {
  const resource = resourceMap.resourceInfo[resourceName];

  if (!resource.lastBuilt || resource.lastBuilt < resource.lastModified) {
    console.log(`BUILDING RESOURCE ${resourceName}`);

    // Copy everything over except the typescript directories
    const items = fs.readdirSync(path.resolve(resourceMap.source, resource.relativePath));
    items.forEach((item) => {
      // Skip copying the typescript directories
      if(resource.tsCompile.includes(item)) {
        return;
      }

      // Create target folder if it doesn't exist
      const targetFolder = path.resolve(resourceMap.output, resource.relativePath);
      if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
      }

      // Start copying
      const itemPath = path.resolve(resourceMap.source, resource.relativePath, item);
      const itemStats = fs.statSync(itemPath);
      if (itemStats.isDirectory()) {
        copyFolderRecursiveSync(itemPath, path.resolve(resourceMap.output, resource.relativePath));
      } else {
        fs.copyFileSync(itemPath, path.resolve(resourceMap.output, resource.relativePath, item));
      }
    });

    // Add the webpack configurations
    resource.tsCompile.forEach((bundle) => {
      if (bundle === 'ui') {
        configurations.push(ResourceTsxConfig({
          mode: 'development',
          sourcePath: path.resolve(resourceMap.source, resource.relativePath, 'ui'),
          outputPath: path.resolve(resourceMap.output, resource.relativePath),
          outputName: 'index.js',
        }));
      } else {
        configurations.push(ResourceTsConfig({
          mode: 'development',
          sourcePath: path.resolve(resourceMap.source, resource.relativePath, bundle),
          outputPath: path.resolve(resourceMap.output, resource.relativePath),
          outputName: `${bundle}.js`,
        }));
      }
    });
  } else {
    console.log(`IGNORING RESOURCE '${resourceName}'`);
  }
});

module.exports = configurations;