# Create a realtime GraphQL-powered web app with Hasura and Gatsby #

##  Hasura to Heroku Quickstart guide ##
 Here: https://hasura.io/docs/latest/graphql/core/deployment/deployment-guides/heroku.html

### Heroku setup (one click install) ###

 * Deploy to Heroku:
  * Log in and "create a new app"
  * Deploy Hasura app: https://dashboard.heroku.com/new?template=https%3A%2F%2Fgithub.com%2Fhasura%2Fgraphql-engine-heroku
  * should have "Heroku Postgres" addon
  * deploy...
* Manage app: Heroku dashboard
* Open app: brings you to the Hasura console (already built by the presets into the Postgress DB attached to this app)

### Hasura / GraphQL / PostgreSQL demo ###

#### DB Tables Setup ####
 * From the defalue 'GraphiQL' dahsboard tab go to 'Data' to start adding some data to the Postgress DB
 * Demo: create a table of blog **posts**:
  * name a new table (e.g. 'posts')
  * create 1st column (post ID):
    * name 1st column (e.g. 'id')
    * type: UUID
    * default_value: FUNCTION => gen_random_uuid() ( = auto-generate random IDs)
    * tick 'unique'
  * create other columns, eg:
    * title (text)
    * content (text)
    * linked user owner (eg 'user_id' of type 'UUID') => another UID, but not to be generated here, because it would be the creator's ID (from another table)
  * set Primary Key to be the 'id' column
  * create table
* CHECK: In GraphiQL you can now check 'Docs' button to the right of the in-browser IDE (might need a wide screen) and this will show "root types" already pre-filled with methods to query(read) /mutate(write) / subscribe-to(receive-status-updates-from) the newly created table
* Create new table: this time for **authors**! (add the fields that you want, making sure there is a UUID as primary key column)
  * PS: when adding a table's column: if you want the field to be able to be empty, you need to set the property 'Nullable' to 'True'
* Now you have 2 tables: but you still need to link them => you need to **set a relationship** between them!
  * Go to Data, select 'posts' table, then 'modify'
  * Set a foreign key in 'Foreign Keys' (from posts.user_id to authors.id)
  * You can check this has now created a relationship in the 'Relationships' tab next to 'Modify' => let's rename it in the GraphQL context:
    * 'Add' => Name: 'author'
  * We can check this relationship in GraphiQL:
    * Document Explorer (Docs):
      * query root:
        * posts(...)
          * [posts!] (<= click here)
            * You can see here an 'object relationship' with 'authors'
  * In 'Data' we can check out 'Relationships' in the 'authors' table:
    * We get a Suggested 'Array Relationship' going back from posts.user_id to authors.id, because we might want to query all posts created by a given author via GraphQL: Hasura is smart and suggests that!
    * Click 'Add', name it 'posts', and Save it
  * We can now create a table for **comments**
    * Same stuff as per the other tables
    * You might want to link a comment to a posts.id and to an authors.id by adding the appropriate columns, foreign ids, then confirming the suggested Object Relationships in the Relationships tab
    * You might also want to link back the relationships by going to the posts and authors table and adding the suggested Array Relationships

#### Adding posts ####

 * Let's go to GraphiQL to build some GraphQL functions!
  * Let's create a post (and its creator) via a GraphQL function. Snippet:
  ```
    mutation {
      insert_posts(objects: [
          {
            author: {
              data: {
                first_name: "UserTest",
                last_name: "SurnameTest"
              }
            }
            title: "Hello World!"
            content: "This is my first post"
          }
        ]) {
          returning{
            id
            user_id
          }
        }
    }
  ```
  * If it works, you'll see the new post as an entry in the posts table (Browse Rows)
  * NOTE: This works, but your API is now public and exposed! I.e. Anyone can query AND write to it --here is how to fix it:
    * Secure your endpoints: https://hasura.io/docs/latest/graphql/core/deployment/deployment-guides/heroku.html#heroku-secure
    * Go back to your app link and refresh (and add the secret key you made)
  * How about modifying the author we just created?
    * Snippet:
    ```
      mutation {
        update_authors(where: {id: {_eq: "71b0ada2-3acf-4e41-b8f3-2e0f1ee0c2b0"}}, _set: {first_name: "Fran", last_name: "P"}) {
          returning {
            id
            first_name
          }
        }
      }
    ```
  * Let's now 'subscribe' to new comments!
    * Snippet:
    ```
      subscription {
        comments{
          comment
        }
      }
    ```
    * This will receive updates every time a comment is made - to test it, keep this tab open and open a new on in the same page:
      * Now try and create a comment -eg:
      ```
        mutation {
            insert_comments(
              objects: {
              	comment: "This is a comment",
              	author_id: "71b0ada2-3acf-4e41-b8f3-2e0f1ee0c2b0",
              	post_id: "c8360cc4-4f0b-4092-8928-e410e1c91b90"
            	}
            ) {
            	returning {
                id
              }
            }
        }
      ```
    * On the original page, the subscription call would have its output already changed and returning the  content of our comment.
  * Now, in reality, if you're working on PostgreSQL, you'll be using something like [pgadmin.org](https://www.pgadmin.org/) to edit the DB data => Don't worry, Hasura will still pick it up and generate the correct GraphQL functions for this data!
  * Also, under "Data", SQL, you can write SQL statements and run them
    * e.g. "SELECT * FROM posts" will return a view of all posts ( * is a wildcard in SQL)
    * e.g.2 "CREATE VIEW viewname AS SELECT * FROM posts" will generate a view in the Table/Views/Funcitons sidebar, which will display all the posts
      * Cool part: now even this 'view' is querable, just like an actual table
* Want to test the query function of GrapQL? No prob: go to the GraphiQL console and type it:
  * Snippet:
  ```
  query {
      posts {
        content
      }
  }
  ```
  * Want to know what SQL functions this query equates to? Click "Analyze" on top of the console!

*Note: Thresults of my playing around so far are available [here](https://hasura-gatsby.herokuapp.com/console/api-explorer)*
*[Link to Overview of the App in my Heroku](https://dashboard.heroku.com/apps/hasura-gatsby)*


#### Let's build a front end (Gatsby) to display our data! ####

* [Install the environmental components needed](https://www.gatsbyjs.com/docs/how-to/local-development/), if you don't have it (find the guide for your OS)
* [Install the Gatsby client](https://www.gatsbyjs.com/docs/reference/gatsby-cli)
* We can use the [HelloWorld scaffolding project](https://gatsbyguides.com/tutorial/hello-world) and choose the bare bone starter: "gatsby-starter-hello-world" *note: you'll need to be logged in to follow the tutorial*
  * Navigate to the folder where you'd like to create your gatsby project through terminal and type:
  ```
    BASH $ gatsby new gatsby-starter-hello-world https://github.com/gatsbyjs/gatsby-starter-hello-world
  ```
  * TEST IT:
    * If you navigate to it with your editor ( I use Atom ), you can check its [package.json](https://nodejs.dev/learn/the-package-json-guide) 'manifesto' for example
    * It should have only a basic index.js page inside its page directory 'src/pages'

* Now we can connect our Hasura app with our local gatsby project:
  * Install Gatsby's GraphQL API connection plugin: [gatsby-source-graphql](https://www.gatsbyjs.com/plugins/gatsby-source-graphql/)
  * You might need to update npm (`npm update`) and install all the required dependencies with `npm install`
  * Find a 'gatsby-config.js' file in the gatsby project folder (same level as package.json), or create if it's not there
    * Your IDE can do it, but you can also create it/open it with a simple `vim gatsby-config.js` in terminal
    * Throgh vim or your IDE of choice, start editing it (you want to follow the guideline provided in the the gatsby-source-graphql plugin page)
      * Here is what we end up with, by following the recommended instructions:
      ```
        module.exports = {
          /* Your site config here */
          plugins: [
                  {
                   resolve: "gatsby-source-graphql",
                   options: {
                     typeName: "GitHub",
                     fieldName: "github",
                     // Create Apollo Link manually. Can return a Promise.
                     createLink: pluginOptions => {
                       return createHttpLink({
                         uri: "https://api.github.com/graphql",
                         headers: {
                           Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                         },
                         fetch,
                       })
                     },
                   },
                 },
               ],
             },
          ],
        }
      ```
      * We'll need to authenticate the https access to our Hasura/GraphQL API, so we'll npm install the module [apollo-link-http](https://www.npmjs.com/package/apollo-link-http)
      * Since we see a 'fetch', let's also install [isomorphic-fetch](https://www.npmjs.com/package/isomorphic-fetch)
      * Let's now pop back over to our open Hasura app, where we need to get:
        * the POST http link (something like `https://your-app-name.herokuapp.com/v1/graphql`)
        * the Request headers details
      * We then need to create a .env file to protect our access key (make sure you have the [dotenv](https://www.npmjs.com/package/dotenv) nmp package installed)
        * In terminal, just "vim it" (`vim .env`), then press `i` to start editing, type `HASURA_GRAPHQL_ADMIN_SECRET=your-secret-value`, press `ESC`, then type `:wq` to quit and save
      * Let's now modify the code to define our requires, constants and insert the right access parameters for our Hasura app:
      ```
        require('dotenv').config()
        const fetch = require("isomorphic-fetch")
        const { createHttpLink } = require("apollo-link-http")


        module.exports = {
          /* Your site config here */
          plugins: [
            {
              resolve: "gatsby-source-graphql",
              options: {
                typeName: "hasura",
                fieldName: "blog",
                createLink: pluginOptions => {
                  return createHttpLink({
                    uri: "https://hasura-gatsby.herokuapp.com/v1/graphql",
                    headers: {
                      "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET,
                    },
                    fetch,
                  })
                },
              },
            },
          ],
        }
      ```
  * Ready to build the site? => run `gatsby develop` in terminal *here -> https://youtu.be/HTEGGndT3zY*
  * If it all builds correcly, you will be able to view your app's site in the browser (should be live @ http://localhost:8000 ). You'll also get the GraphiQL in-browser IDE to explore your site's data and schema ( http://localhost:8000/___graphql )
    * To test our GraphQL API built with Hasura, head to this link and try a query out, eg:
    ```
      query MyQuery {
        blog {
          posts {
            title
          }
        }
      }

    ```
    *─which in my case returned a JSON with my posts (the only one I made) and their title*
    * Pro tip: leave this window open in your browser to help you create GraphQL queries. You can then copy these and paste them into your app via javascript scripts.

#### Building the realtime webapp ####

The power of having a GraphQL API on top of a Database, means that we can now add dynamic content to otherwise static pages.

 * Let's head over to our gatsby site folder and navigate to the source home page file: src/pages/index.js
   * Under the React import 1st line, we can replace the default content with some custom code that will query our API dynamically:
   ```
     import { graphql } from 'gatsby';

      export const query = graphql`{
        blog {
         posts {
           id
           title
           content
           author {
             first_name
             last_name
           }
         }
        }
      }`;

      export default function Home({data}) {
        return <div style={{margin: '5rem auto', width: '550px'}}>
          {
           data.blog.posts.map(post=>(
             <article key={post.id}>
               <h2>{posts.title}</h2>
               <p>
                 Written by {post.author.first_name} {post.author.last_name}
               </p>
             </article>
           ))
          }
        </div>
      }
   ```
   * As soon as we save the file, our terminal process (which should be running in the background) should rebuild the site for us.
   * The results should go immediately live on the localhost link where our app lives
 * We can now head back to our Hasura app on Heroku and test our dynamic app by adding some content, for example another post.
   * We can manually do it by going to the posts table in the Data tab and cliking Insert Row
     * Tip: copy the user id from the other post to assign it to the same author
     * leave the id as default (as it will generate with the function we set up at the beginning)
     * add a title and some content
 * Now we have 2 posts by the same author: 1 with a comment, 1 without. Let's play around with it (I'll be using the GraphiQL IDE to help me build the queries):
   * We can add, for example, this snipper under the `author {...}` element of our index pages
   * We can then render it by adding the following within our `<article></article>` tags: `<p>Comments:{posts.comments_aggregate.aggregate.count}</p>`
   * Once you save your app should now display a list of posts with their authors and the number of comments each has

#### Programmatically display posts as pages ####

Would you like each of the posts made to have its own page? We can dynamically do that too:

   * Let's add a `gatsby-node.js` file on the same level of our `package.json`
   * Inside this doc we are going to create a global funtion called `createPages`, which we'll make async so that we don't have to write [promises](https://javascript.info/promise-basics).This function is also going to accept some actions *─one of these is the Gatsby's createPage and it's also going to have a graphQL helper function*
     * Here the code:
     ```
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
     ```
   * We then need to create a template page for the post ( in "src", where I'm making a subfolder for it and call it "templates"): `post.js`
     * We'll need to `import React from 'gatsby'` and to `import { graphql } from 'gatsby'`
     * We will also need to a query function, which will take a variable *─this will be the post "id" set by the 'context', when we call createPage in our gatsby-node.js*
       * We can use once more the GraphiQL web IDE to help us build the query, which is my case is:
       ```
      query ($id: hasura_uuid! = "c8360cc4-4f0b-4092-8928-e410e1c91b90") {
        blog {
          posts_by_pk(id: $id) {
            title
            author {
              first_name
            }
          }
        }
      }
       ```
       * We can then paste this without the  `= "string"` part into the query string we're defining in `post.js`(i.e. `query ($id: hasura_uuid!){...}`)
       * We can finally create a default component to display some content in each post's page:
         * Here a silly hacky example:
        ```
      export default function displayPostContent({data}){
        const post = data.blog.post;
        return <pre>{JSON.stringify(post, null, 2)}</pre>
      }
        ```
    * Done! If we 'break' the navigation of our site and generate the default "Gatsby 404 page", we can chek these pages:
      * Try going to something like "http://localhost:8000/none"!
      * You should see a clickable list of posts with url /post/unique_id
      * If you click on these, you should see a stringified version ouf our queried post as a JSON objects

  #### Map a simple website ####

  Now that we have some live pages (our posts), we can make the post content a bit 'prettier' and create automatic links to and from the homepage.

   * In our `post.js`:
     * we need to add `Link` to the libraries we import from Gatsby (alongside `grapql`)
     * we can then change the 'return' of our default component function to have some style and some html (like a title, etc) - crucially, we add the following html above the title, to link back to the home page: `<Link to="/">&larr; back to all post index</Link>`
   * In our `index.js`:
     * we also need to import `Link`
     * and then use the post's id within the display function to create links:
     ```
     <Link to={`/post/${post.id}`}><h2>{posts.title}</h2to the></Link>
     ```
     *Note: make sure you are querying the post id through graphql, so that your function can retrieve it!*
   * Now we should have a fully linked site, with an index of clickable post titles, and post pages linking back to the index: It's finally time to build into our webapp some **realtime dynamic stuff** with [Apollo](https://www.apollographql.com/docs/intro/platform/)

#### HERE ####
https://youtu.be/HTEGGndT3zY?t=4455
