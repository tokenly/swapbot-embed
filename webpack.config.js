const path = require('path');

const PATHS = {
  app: path.join(__dirname, 'src'),
  buildjs: path.join(__dirname, 'public/js')
};


module.exports = {
    entry: [
        PATHS.app+'/index.js'
    ],
    output: {
        path: PATHS.buildjs,
        publicPath: '/js/',
        filename: 'swapbotsdk-0.0.1.js'
    },
    module: {
        loaders: [
            {
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015', 'stage-1']
                }
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    devtool: 'source-map',
    devServer: {
        historyApiFallback: true,
        contentBase: './public'
    }
};
