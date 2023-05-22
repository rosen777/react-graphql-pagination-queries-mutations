import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Loading } from "./Loading";
import RepositoryList from "./Repository";

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    viewer {
      login
      name
    }
  }
`;

const GET_REPOSITORIES_OF_CURRENT_USER = gql`
  {
    viewer {
      repositories(first: 5, orderBy: { direction: DESC, field: STARGAZERS }) {
        edges {
          node {
            id
            name
            url
            descriptionHTML
            primaryLanguage {
              name
            }
            owner {
              login
              url
            }
            stargazers {
              totalCount
            }
            viewerHasStarred
            watchers {
              totalCount
            }
            viewerSubscription
          }
        }
      }
    }
  }
`;

export const Profile = () => {
  const { loading, error, data } = useQuery(GET_REPOSITORIES_OF_CURRENT_USER);
  const viewer = data?.viewer;
  console.log(`Profile Data: ${JSON.stringify(data)}`);

  if (loading || !viewer) return <Loading />;
  if (error) return `Error: ${error.message}`;

  return <RepositoryList repositories={viewer.repositories} />;
};
