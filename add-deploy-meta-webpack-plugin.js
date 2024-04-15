const { validate } = require("schema-utils");
const { metaVersion } = require("meta-version");

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
        compiler.hooks.compilation.tap(
            "AddDeployMetaWebpackPlugin",
            (compilation) => {
                compilation.hooks.optimizeChunkAssets.tapAsync(
                    "AddDeployMetaWebpackPlugin",
                    (chunks, callback) => {
                        chunks.forEach((chunk) => {
                            if (chunk.name === "main") {
                                chunk.files.forEach((file) => {
                                    const asset = compilation.assets[file];
                                    let content = asset.source();
                                    const self = this;

                                    const meta = metaVersion();

                                    // Possible to much unnecessary info
                                    delete meta.package.dependencies;

                                    const valueToInject = {
                                        ...meta,
                                        extraData: self.options.extraData,
                                    };

                                    // Inject the function and use it to assign the value
                                    const injection = `
(function () {
    // Function to safely assign a value to a path inside an object
    const assignValueToPath = (path, value, obj) => {
        const keys = path.split(".");
        keys.reduce((acc, key, index) => {
            acc[key] = index === keys.length - 1 ? value : acc[key] || {};
            return acc[key];
        }, obj);
    };

    const path = "${self.options.path}";
    const value = ${JSON.stringify(valueToInject)};
    const isInNode = Boolean(typeof process !== 'undefined' && process.versions && process.versions.node);
    assignValueToPath(path, value, isInNode ? global : window);
})();\n`;
                                    content = injection + content;
                                    compilation.assets[file] =
                                        new compiler.webpack.sources.RawSource(
                                            content,
                                        );
                                });
                            }
                        });
                        callback();
                    },
                );
            },
        );
    }
}

module.exports = AddDeployMetaWebpackPlugin;
