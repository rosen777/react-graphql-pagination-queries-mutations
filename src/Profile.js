import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Loading } from "./Loading";
import RepositoryList, { REPOSITORY_FRAGMENT } from "./Repository";
import { ErrorMessage } from "./Error";
import { useLocation, useMatch } from "react-router-dom";

import * as routes from "./constants/routes";

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    viewer {
      login
      name
    }
  }
`;

const GET_REPOSITORIES_OF_CURRENT_USER = gql`
  query ($cursor: String) {
    viewer {
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

  ${REPOSITORY_FRAGMENT}
`;

export const Profile = () => {
  const { loading, error, data, fetchMore } = useQuery(
    GET_REPOSITORIES_OF_CURRENT_USER,
    {
      notifyOnNetworkStatusChange: true,
    }
  );

  const viewer = data?.viewer;
  console.log(`Profile Data: ${JSON.stringify(data)}`);
  const pageInfo = data?.viewer?.pageInfo;

  if (error) return <ErrorMessage error={error} />;
  if (loading || !viewer) return <Loading />;

  return (
    <RepositoryList
      loading={loading}
      repositories={viewer.repositories}
      entry={"viewer"}
      fetchMore={fetchMore}
    />
  );
};
