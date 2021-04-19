import React from "react";
import { graphql, Link } from 'gatsby';

export const query = graphql`
  {
    blog {
      posts {
        id
        title
        content
        author {
          first_name
          last_name
        }
        comments_aggregate {
          aggregate {
            count
          }
        }
      }
    }
  }`;

export default function Home({data}) {
  return <div style={{margin: '5rem auto', width: '550px'}}>
    {
      data.blog.posts.map( post=> (
        <article key={post.id}>
          <Link to={`/post/${post.id}`}><h2>{post.title}</h2></Link>
          <p>
            Written by {post.author.first_name} {post.author.last_name}
          </p>
          <p>
            Comments: {post.comments_aggregate.aggregate.count}
          </p>
        </article>
      ))
    }
  </div>
}
