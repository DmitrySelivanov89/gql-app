module.exports = {
    transpileDependencies: [
        'vuetify'
    ],
    chainWebpack: (config) => {
        config.module
            .rule("graphql")
            .test(/\.(graphql|gql)$/)
            .use("graphql-tag/loader")
            .loader("graphql-tag/loader")
            .end();
    },
    // loaders: {
    //     config: "gql",
    //     test: /\.(graphql|gql)$/,
    //     exclude: /node_modules/,
    //     loader: "graphql-tag/loader"
    // }
}
