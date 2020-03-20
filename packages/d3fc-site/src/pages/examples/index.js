import React from "react";
import { graphql } from "gatsby";
import SEO from "../../components/SEO";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import LocalGists from "../../components/LocalGists";
import BlockGists from "../../components/BlockGists";
import {
  generalGists,
  financialIndicatorGists,
  financialGists,
} from "../../static/exampleGists";

const getExamplesBySection = edges =>
  edges.reduce((acc, { node }) => {
    const { frontmatter, fields } = node;
    if (acc[frontmatter.section]) {
      return {
        ...acc,
        [frontmatter.section]: [
          ...acc[frontmatter.section],
          { slug: fields.slug, title: frontmatter.title },
        ],
      };
    }
    return {
      ...acc,
      [frontmatter.section]: [{ slug: fields.slug, title: frontmatter.title }],
    };
  }, {});

const Template = ({ data, location }) => {
  const { examples, intro } = data;
  const { html, frontmatter } = intro;
  const { edges } = examples;
  const examplesBySection = getExamplesBySection(edges);
  const { pathname } = location;

  return (
    <>
      <SEO title={frontmatter.title} />
      <div className="content">
        <Header currentPathname={pathname} />
        <div className="container content">
          <div className="col-sm-9 col-xs-12">
            <div dangerouslySetInnerHTML={{ __html: html }} />
            <LocalGists examplesBySection={examplesBySection} />
            <BlockGists
              title="General charting examples"
              gists={generalGists}
            />
            <BlockGists
              title="Financial charting examples"
              gists={financialGists}
            />
            <BlockGists
              title="Financial indicators"
              gists={financialIndicatorGists}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export const query = graphql`
  query ExamplesPageQuery {
    examples: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "//examples/(.*)README\\\\.md/" } }
    ) {
      edges {
        node {
          frontmatter {
            title
            section
          }
          fields {
            slug
          }
        }
      }
    }
    intro: markdownRemark(fileAbsolutePath: { regex: "/examples-page/" }) {
      html
      frontmatter {
        title
      }
    }
  }
`;

export default Template;
