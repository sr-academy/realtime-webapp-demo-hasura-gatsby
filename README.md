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

#### Tables Setup ####
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
* We can use the [HelloWorld scaffolding project](https://gatsbyguides.com/tutorial/hello-world) *note: you'll need to be logged in to follow the tutorial*
*
