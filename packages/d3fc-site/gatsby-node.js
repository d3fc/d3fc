const path = require("path");
const express = require("express");
const { createFilePath } = require(`gatsby-source-filesystem`);

// Needed for iframes to render correctly in dev mode
exports.onCreateDevServer = ({ app }) => {
  app.use(express.static("public"));
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    const directory = value.split("/README")[0];
    createNodeField({
      name: `slug`,
      node,
      value: directory,
    });
  }
};

const createIntroductionPages = async (graphql, createPage) => {
  const documentationTemplate = path.resolve("src/templates/documentation.js");

  const result = await graphql(`
    {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "//introduction//" } }
      ) {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const { slug } = node.fields;

    createPage({
      path: slug,
      component: documentationTemplate,
      context: { slug },
    });
  });
};

const createExamplePages = async (graphql, createPage) => {
  const exampleTemplate = path.resolve("src/templates/example.js");

  const result = await graphql(`
    {
      allMarkdownRemark(
        filter: {
          fileAbsolutePath: {
            regex: "//examples/(.*)README\\\\.md/"
          }
        }
      ) {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const { slug } = node.fields;
    const path = `/examples${slug}`;

    createPage({
      path,
      component: exampleTemplate,
      context: { slug },
    });
  });
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  await Promise.all([
    createIntroductionPages(graphql, createPage),
    createExamplePages(graphql, createPage),
  ]);
};
