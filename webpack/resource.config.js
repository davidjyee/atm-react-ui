// Common webpack used for compiling resource bundles
module.exports = (options) => ({
  ...options,
  module: {
    rules: [
      // TypeScript JSX Transpiling
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(scss|css)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        // Preprocess 3rd party .css files located in node_modules if you have them
        test: /\.(scss|css)$/,
        include: /node_modules/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      // Allows for SVG Use
      {
        test: /\.svg$/,
        use: [
          {
            loader: "svg-url-loader",
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024,
              noquotes: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      } 
    ]
  },
})