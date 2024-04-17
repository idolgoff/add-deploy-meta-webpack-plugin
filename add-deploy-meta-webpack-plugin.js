const { validate } = require("schema-utils");
const { metaVersion } = require("meta-version");
const AddToGlobalWebpackPlugin = require("add-to-global-webpack-plugin");

const schema = {
    type: "object",
    properties: {
        path: {
            type: "string",
        },
        extraData: {
            anyOf: [
                { type: "string" },
                { type: "number" },
                { type: "object" },
                { type: "array" },
                { type: "boolean" },
                { type: "null" },
            ],
        },
    },
    required: ["path"],
    additionalProperties: false,
};

/**
 * A Webpack plugin that assigns a value to a nested property on the window or global object.
 */
class AddDeployMetaWebpackPlugin {
    /**
     * Creates an instance of AddDeployMetaWebpackPlugin.
     * @param {Object} options - The options for the plugin.
     * @param {string} options.path - The path to the property on the window object.
     * @param {*} options.extraData - The extra data to assign to the property in addition to meta that is auto collected .
     */
    constructor(options) {
        validate(schema, options, {
            name: "Add To Global Webpack Plugin",
            baseDataPath: "options",
        });

        this.options = options;
    }

    apply(compiler) {
        const meta = metaVersion();
        // Possible to much unnecessary info
        delete meta.package.dependencies;

        const valueToInject = {
            ...meta,
            extraData: this.options.extraData,
        };

        const addToGlobalWebpackPlugin = new AddToGlobalWebpackPlugin({
            path: this.options.path,
            value: valueToInject,
        });
        addToGlobalWebpackPlugin.apply(compiler);
    }
}

module.exports = AddDeployMetaWebpackPlugin;
