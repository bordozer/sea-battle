const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const BUILD_DIR = './src/main/resources/static/built/';
const getFilesFromDir = require("./src/main/webapp/js/config/files");
const PAGE_DIR = path.join("./src/main/webapp/js/", "pages", path.sep);

const htmlPlugins = getFilesFromDir(PAGE_DIR, [".html"])
    .map(filePath => {
        const fileName = filePath.replace(PAGE_DIR, "");
        return new HtmlWebPackPlugin({
            chunks: [fileName.replace(path.extname(fileName), ""), "vendor"],
            template: filePath,
            filename: fileName
        })
    });

const entry = getFilesFromDir(PAGE_DIR, [".js"]).reduce((obj, filePath) => {
    const entryChunkName = filePath.replace(path.extname(filePath), "").replace(PAGE_DIR, "");
    obj[entryChunkName] = BUILD_DIR + `${filePath}`;
    return obj;
}, {});

module.exports = {
    entry: entry,
    plugins: [
        ...htmlPlugins
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, BUILD_DIR)
        // path: path.resolve(__dirname, './src/main/resources/static/built/')
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, "src"),
            components: path.resolve(__dirname, "src", "components")
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react"
                        ],
                    }
                },
            }]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    chunks: "initial",
                    name: "vendor",
                    enforce: true
                }
            }
        }
    }
};
