# ATM React UI Example

This is an example React UI for an ATM. It's been built using the ESX NUI React Template by @Taso.

It's configured to be used in a FiveM NUI resource, and the resource can be found here:
https://github.com/davidjyee/atm-react-nui-example

## Features
### General Interface
- Supports three different modes: fleeca-teller, fleeca-atm, atm
    - Each mode has different permissions attached: fleeca-teller can do everything, fleeca-atm can do everything but manage account holders, atm can only withdraw
- Four main pages: actions, details, management, and transactions page
- Layout has an account change select along the top for quick access to other accounts
- Layout also displays the current user's details for quick user verification and cash amounts
### Actions Page
- Supported actions are withdrawals, deposits, and transfers
- Number verification for inputted amounts: 
    - Must be a positive number, with a maximum of two decimal places
    - Must have the amount in the origin account
    - Must be at least the minimum amount ($1000 for transfers, $0 for deposits/withdrawals)
- Only one action can be opened at a time, prevents multiple actions from being done at once
### Details Page
- Displays account name, type, number, routing, and balance on the details page
### Management Page
- The management page allows a user to view, add, edit, and remove the other account holders
- Prevents the editing and removal of your own access
### Transactions Page
- All transactions related to the current account are shown on the transactions page
- Transaction locks prevent multiple transactions from occurring at once
- All transactions update server-side immediately to prevent desyncs

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

