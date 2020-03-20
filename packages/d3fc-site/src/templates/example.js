import React from "react";
import { graphql } from "gatsby";
import SEO from "../components/SEO";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Template = ({ data }) => {
  const { frontmatter, html, fields } = data.markdownRemark;
  const title = frontmatter.title;
  const slug = fields.slug;

  return (
    <>
      <SEO title={title} />
      <div className="content">
        <Header />
        <div className="container content">
          <div className="col-sm-9 col-xs-12">
            <h1>{title}</h1>
            <iframe
              className="d3fc-preview"
              title="d3fc-preview"
              src={`${slug}/index.html`}
            />
            <h1>
              <a
                className="btn btn-default gh"
                href={`https://github.com/d3fc/d3fc/tree/master/examples${slug}`}
              >
                View on GitHub
              </a>
            </h1>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export const query = graphql`
  query($slug: String!) {
    markdownRemark(
      fields: { slug: { eq: $slug } }
      fileAbsolutePath: { regex: "/examples/" }
    ) {
      html
      frontmatter {
        title
      }
      fields {
        slug
      }
    }
  }
`;

export default Template;
