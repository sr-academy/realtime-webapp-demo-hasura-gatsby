/**
Global export of a function that generates pages for our webapp
Note - this function uses:
 * the createPages function from the Gatsby Node API
 * a graphql helper function for createPage
*/
exports.createPages = async({ actions: { createPage }, graphql }) => {

  const result = await graphql(`
    {
      blog {
        posts {
          id
          title
        }
      }
    }
  `);

  //TODO: handle errors!

  //Debuggin tool to check the actual object we get back from the above query:
  //console.log(result);

  const posts = result.data.blog.posts;

  posts.forEach(post => {
    //for each post in the posts array, create a page object
    createPage({
      //set page path
      path: `/post/${post.id}/`,
      /*
      THE ABOVE IS QUITE UGLY AS a unique link!
      In a real app you could write a helper function here to create unique links
      based on titles, dates, etc and that ensures no duplicates
      */
      component: require.resolve('./src/templates/post.js'),
      //set a context variable that will be useful for making a graphql query
      context: {
        id: post.id
      }
    })
  });
}
