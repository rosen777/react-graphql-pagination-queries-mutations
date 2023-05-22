import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Loading } from "./Loading";
import RepositoryList from "./Repository";
import { ErrorMessage } from "./Error";

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

  if (error) return <ErrorMessage error={error} />;
  if (loading || !viewer) return <Loading />;

  return <RepositoryList repositories={viewer.repositories} />;
};
