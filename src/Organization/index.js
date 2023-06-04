import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { REPOSITORY_FRAGMENT } from "../Repository";
import { ErrorMessage } from "../Error";
import { Loading } from "../Loading";
import { RepositoryList } from "../Repository/RepositoryList";
import { useLocation, useMatch } from "react-router-dom";
import { OrganizationSearch } from "../OrganizationSearch";

import * as routes from "../constants/routes";

const GET_REPOSITORIES_OF_ORGANIZATION = gql`
  query ($organizationName: String!, $cursor: String) {
    organization(login: $organizationName) {
      repositories(first: 5, after: $cursor) {
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

export const Organization = () => {
  const [organizationName, setOrganizationName] = useState(
    "the-road-to-learn-react"
  );
  const { loading, error, data, fetchMore } = useQuery(
    GET_REPOSITORIES_OF_ORGANIZATION,
    {
      variables: {
        organizationName,
      },
      skip: organizationName === "",
      notifyOnNetworkStatusChange: true,
    }
  );

  console.log(`organizationName: ${organizationName}`);

  const location = useLocation();

  const match = useMatch(routes.ORGANIZATION);

  console.log(location);

  console.log(match);

  if (error) {
    return <ErrorMessage error={error} />;
  }

  const organization = data?.organization;

  if (loading && !organization) {
    return <Loading />;
  }

  const onOrganizationSearch = (value) => {
    setOrganizationName(value);
  };

  return (
    <div>
      {match && (
        <OrganizationSearch
          organizationName={organizationName}
          onOrganizationSearch={onOrganizationSearch}
        />
      )}
      <RepositoryList
        loading={loading}
        repositories={organization.repositories}
        fetchMore={fetchMore}
        entry={"organization"}
      />
    </div>
  );
};
