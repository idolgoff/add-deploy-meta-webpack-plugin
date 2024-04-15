const webpack = require("webpack");
const { createFsFromVolume, Volume } = require("memfs");

const AddDeployMetaWebpackPlugin = require("./add-deploy-meta-webpack-plugin"); // Import your plugin

const fs = createFsFromVolume(new Volume());

test("AddDeployMetaWebpackPlugin test", (done) => {
    const compiler = webpack({
        // Your webpack config here
        mode: "development",
        context: __dirname, // This is the root of your project
        entry: "./dummy.js",
        output: {
            path: "/dist",
            filename: "main.js",
        },
        plugins: [
            new AddDeployMetaWebpackPlugin({
                path: "foo.bar.path",
            }),
        ],
    });

    compiler.outputFileSystem = fs;

    compiler.run((err, stats) => {
        if (err) {
            return done(err);
        } else if (stats.hasErrors()) {
            return done(new Error(stats.toString()));
        }

        const outputCode = fs.readFileSync("/dist/main.js").toString();

        expect(outputCode).toContain('"name":"add-deploy-meta-webpack-plugin"');

        done();
    });
});
