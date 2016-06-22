const path = require('path');

const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'public/js'),
  style: path.join(__dirname, 'public/css')
};


module.exports = {
    entry: [
        PATHS.app+'/index.js'
    ],
    output: {
        path: PATHS.build,
        publicPath: '/',
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
            },
            {
                test: /(\.scss|\.sass)$/,
                loaders: ['style', 'css', 'sass'],
                include: PATHS.style
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    devtool: 'source-map',
    devServer: {
        historyApiFallback: true,
        contentBase: './'
    }
};
