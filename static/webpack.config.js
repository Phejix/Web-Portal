const webpack = require('webpack');

const config = {
    entry:  {
        welcome: './scripts/welcome_page.jsx',
        search_lens : './scripts/SearchLens/search_lens.jsx',
        header_toolbar : './scripts/HeaderToolbar/header_toolbar.jsx',
        capsule_viewer : './scripts/CapsuleViewer/capsule_viewer.jsx',
        textify : './scripts/Textify/textify.jsx',
        surveysaur : './scripts/Surveysaur/surveysaur.jsx',
        surveysaur_host : './scripts/Surveysaur/surveysaur_host.jsx',
        ddc_templating : './scripts/DDC Templating/ddc_template.jsx'
    },
    output: {
        path: __dirname + '/bundles',
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
    module: {
        rules: [
            {
                test: /\.jsx?/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    }
};

module.exports = config;