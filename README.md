# ATM React UI Example

This is an example React UI for an ATM. It's been built using the ESX NUI React Template by @Taso.

It's configured to be used in a FiveM NUI resource, and the resource can be found here:
https://github.com/davidjyee/atm-react-nui-example

## First Install
As with any other Node environment, you must first run one of the following commands:
```
# Yarn
yarn 
# NPM
npm i
```

## Building
To create a build for use in FiveM. Run the two following scripts 
depending on the use-case.

### Development

```
# Yarn:
yarn build:dev

# NPM
npm run build:dev 
```

### Production

```
# Yarn:
yarn build:prod

# NPM
npm run build:prod 
```

After build, these scripts can be found in the build folder of the 
project directory as shown:
```
|-- build
    |-- index.html
    |-- index.js
```

*These builds differ in a couple of ways, most specifically: process.env.NODE_ENV, 
source maps, minification, and the inclusion of a react-devtools module*

## Linting and Style
This template also comes with a preconfigured ESLint and Prettier config.
Both of these are run when using any of the build scripts. They can 
also be run manually using:

```
# Prettier
yarn format
# ESLint
yarn lint
```

