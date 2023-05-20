import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  gql,
} from "@apollo/client";
import "cross-fetch/polyfill";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://api.github.com/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`,
    },
  };
});

const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

console.log(`token ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`);

// const GET_ORGANIZATION = gql`
//   query ($organization: String!) {
//     organization(login: $organization) {
//       name
//       url
//       repositories(first: 5) {
//         edges {
//           node {
//             name
//             url
//           }
//         }
//       }
//     }
//   }
// `;

const GET_REPOSITORIES_OF_ORGANIZATION = gql`
  query ($organization: String!, $cursor: String) {
    organization(login: $organization) {
      name
      url
      repositories(
        first: 5
        orderBy: { direction: DESC, field: STARGAZERS }
        after: $cursor
      ) {
        edges {
          node {
            ...repository
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  fragment repository on Repository {
    name
    url
  }
`;

client
  .query({
    query: GET_REPOSITORIES_OF_ORGANIZATION,
    variables: {
      organization: "the-road-to-learn-react",
      cursot: undefined,
    },
  })
  .then((result) => {
    //resolve first page
    const { pageInfo, edges } = result.data.organization.repositories;
    const { endCursor, hasNextPage } = pageInfo;

    console.log("second page", edges.length);
    console.log("endCursor", endCursor);

    return pageInfo;
  })
  .then(({ endCursor, hasNextPage }) => {
    // query second page
    if (!hasNextPage) {
      throw Error("no next page");
    }
    return client.query({
      query: GET_REPOSITORIES_OF_ORGANIZATION,
      variables: {
        organization: "the-road-to-learn-react",
        cursor: endCursor,
      },
    });
  })
  .then((result) => {
    // resolve second page
    const { pageInfo, edges } = result.data.organization.repositories;
    const { endCursor, hasNextPage } = pageInfo;

    console.log("second page", edges.length);
    console.log("endCursor", endCursor);

    return pageInfo;
  })
  .catch(console.log);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
