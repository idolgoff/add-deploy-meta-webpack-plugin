# AddDeployMetaWebpackPlugin

Supercharge your webpack with this plugin! Injects deploy and bundle metadata into your global window object. Get git, build, and package details at your fingertips. Debug smarter, not harder.

## Installation

Install the plugin with npm:

```bash
npm install add-deploy-meta-webpack-plugin --save-dev
```

## Usage

First, import the plugin in your webpack.config.js:

```javascript
const AddDeployMetaWebpackPlugin = require("add-deploy-meta-webpack-plugin");
```

Then, add the plugin to your webpack configuration:

```javascript
module.exports = {
    // ... other configurations
    plugins: [
        new AddDeployMetaWebpackPlugin({
            path: "your.path.here", // The path to the property on the window object.
            extraData: {
                /* your extra data here */
            }, // The extra data to assign to the property in addition to meta that is auto collected.
        }),
    ],
};
```

## Options

The AddDeployMetaWebpackPlugin constructor accepts an options object:

-   path (string): The path to the property on the window object.
-   extraData (any): The extra data to assign to the property in addition to meta that is auto collected.

## Example

Here’s an example of how to use the plugin:

```javascript
new AddDeployMetaWebpackPlugin({
    path: 'myApp.meta',
    extraData: { custom: 'Custom Data' },
}),
```
