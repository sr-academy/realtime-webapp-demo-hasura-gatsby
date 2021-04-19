# Create a realtime GraphQL-powered web app with Hasura and Gatsby #

*By Francesco Perticarari*

This project showcases how to build a bare bone srealtime dynamic webapp using:
* A static site generator (based on a modern JS framework)
* A database
* A connection engine to link the two via an API
* An API query language
* A query and data management framework

We will be using, specifically:
1. Gastby (which is bult on top of React)
2. PostgreSQL (hosted on Heroku)
3. Hasura.io (hosted on Heroku)
4. GraphQL
5. The [Apollo open-source server](https://www.apollographql.com/docs/intro/platform)
5. The basic web developer tools: a browser, an IDE and a command line executing interface (e.g. a Terminal console)

I've logged a step-by-step development log you can use to recreate this repo from scratch and learn the techniques and concepts used. You can find this "Dev_Log" right [here](Dev_Log.md) next to this Readme file.

* **Why [GraphQL](https://graphql.org/)?** Because it's a much neater way to get data then REST and build your API!
* **Why PostgreSQL?** Because it's the industry standard for relational databases...and [Hasura.io](https://hasura.io) works with these. For now. *Hopefully a MongoDB (NoSQL) integration will be ready in [Q2 this year](https://hasura.io/graphql/database/mongodb/)*.
* **Why Gatsby?** Because it's a nice wrapper for React to create static websites that are fast and serverless by default.

## Status ##

### Done ###
* Static website simple wrapper (local machine)
* DB setup and dummy content
* Heroku database/API webapp wrapper built and launched with Hasura
* Static conent API queries
  * *tested with simple objects, i.e. "blog posts"*

### TODO ###
* Comments porting and live subscriptions (with Apollo)
