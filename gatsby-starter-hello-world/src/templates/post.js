import React from 'react';
import { graphql, Link } from 'gatsby';

// build a query function that will take a variable
// this will be set by the 'context'
export const postConteQuery = graphql`
query ($id: hasura_uuid!) {
  blog {
    post: posts_by_pk(id: $id) {
      title
      author {
        first_name
        last_name
      }
    }
  }
}
`

/**
Hacky stupid post content displaying by showing the sring version of our query
*/
export default function displayPostContent({data}){
  const post = data.blog.post;

  return (
    <div style={{margin: '5rem auto', width: '550px'}}>
      <Link to="/">&larr; back to all post index</Link>
      <h2>{post.title}</h2>
      <p>
        Written by {post.author.first_name} {post.author.last_name}
      </p>
      <p>
      {post.content}
      </p>
      <div id="comments"></div>
    </div>
  )
}

/*

*/
