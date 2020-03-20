var path = require("path");

module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `examples`,
        path: path.join(__dirname, '../..', 'examples'),
        ignore: [path.join(__dirname, '../..', 'examples/README.md')],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `templates`,
        path: `${__dirname}/src/templates`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-embed-snippet`,
            options: {
              directory: `${path.join(__dirname, '../..')}`,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {},
          },
        ],
      },
    },
    `gatsby-plugin-catch-links`,
    {
      resolve: "examples-to-public",
      options: {
        desiredFilenames: [
          "index.html",
          "index.js",
          "style.css",
          "screenshot.png",
        ],
      },
    },
  ],
};
