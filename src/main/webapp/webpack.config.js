const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const getFilesFromDir = require("./src/config/files");
const PAGE_DIR = path.join("./src", "pages", path.sep);

const HTML_WEB_PACK_PLUGIN_MINIFY_OPTIONS = {
    collapseWhitespace: true,
    preserveLineBreaks: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: true
};

const htmlPlugins = getFilesFromDir(PAGE_DIR, [".html"])
    .map(filePath => {
        const fileName = filePath.replace(PAGE_DIR, "");
        return new HtmlWebPackPlugin({
            chunks: [fileName.replace(path.extname(fileName), ""), "vendor"],
            template: filePath,
            filename: fileName,
            minify: HTML_WEB_PACK_PLUGIN_MINIFY_OPTIONS
        })
    });

const entry = getFilesFromDir(PAGE_DIR, [".js"])
    .reduce((obj, filePath) => {
        const entryChunkName = filePath.replace(path.extname(filePath), "").replace(PAGE_DIR, "");
        obj[entryChunkName] = `./${filePath}`;
        return obj;
    }, {});

module.exports = (env, options) => {
    return {
        entry: entry,
        plugins: [
            ...htmlPlugins
        ],
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'build')
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
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "@babel/preset-env",
                                "@babel/preset-react", {
                                    'plugins': ['@babel/plugin-proposal-class-properties']
                                }
                            ],
                        }
                    },
                },
                {
                    test: /\.html$/,
                    use: 'html-loader'
                },
                {
                    test: /\.css$/,
                    loader: "style-loader!css-loader"
                },
                {
                    test: /\.(jpg|png|gif)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            limit: 8000, // Convert images < 8kb to base64 strings
                            name: 'images/[hash]-[name].[ext]'
                        }
                    }]
                },
                {
                    test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
                    use: 'file-loader'
                },
                {
                    test: /favicon\.ico$/,
                    loader: 'url-loader',
                    query: {
                        limit: 1,
                        name: '[name].[ext]',
                    },
                }
            ]
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
        },
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            compress: true,
            useLocalIp: false,
            port: 3100
        }
    }
};
