import React from "react";
import { graphql } from "gatsby";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";

const Template = ({ data }) => {
  const { markdownRemark } = data;
  const title = markdownRemark.frontmatter.title;
  const html = markdownRemark.html;
  const slug = markdownRemark.fields.slug;
  const githubLink = `https://github.com/d3fc/d3fc/tree/master/packages/d3fc-site/src${slug.slice(0, -1)}.md`;

  return (
    <>
      <SEO title={title} />
      <div className="content">
        <Header />
        <div className="container content">
          <div className="col-sm-9 col-xs-12">
            <h1>{title}</h1>
            <div dangerouslySetInnerHTML={{ __html: html }} />
            <p className="edit-page-block">
              Found a problem in this page?{" "}
              <a href={githubLink} target="_blank" rel="noopener noreferrer">
                Submit a fix!
              </a>
            </p>
          </div>
          <SideBar />
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
      fileAbsolutePath: { regex: "/introduction/" }
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
