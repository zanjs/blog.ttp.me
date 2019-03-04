import React, { useState } from 'react'
import { graphql } from 'gatsby'

import { rhythm } from '../utils/typography'
import * as Lang from '../constants'
import { Layout } from '../layout'
import { Head } from '../components/head'

export default ({ data, location }) => {
  const [lang, setLang] = useState(Lang.ENGLISH)
  const resumes = data.allMarkdownRemark.edges
  const { siteMetadata } = data.site
  const resume = resumes
    .filter(({ node }) => node.frontmatter.lang === lang)
    .map(({ node }) => node)[0]

  return (
    <Layout location={location} title={siteMetadata.title}>
    <Head title={siteMetadata.title} keywords={siteMetadata.keywords} />
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(24),
        padding: `${rhythm(0.5)} ${rhythm(3 / 4)} ${rhythm(1.5)} ${rhythm(
          3 / 4
        )}`,
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: resume.html }} />
    </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(filter: { frontmatter: { category: { eq: null } } }) {
      edges {
        node {
          id
          excerpt(pruneLength: 160)
          html
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            lang
          }
        }
      }
    }
  }
`
