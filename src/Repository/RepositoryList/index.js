import React, { Fragment } from "react";
import { RepositoryItem } from "../RepositoryItem";
import { FetchMore } from "../FetchMore";
import { Loading } from "../../Loading";
import "../style.css";

const updateQuery = (previousResult, { fetchMoreResult }) => {
  if (!fetchMoreResult) {
    return previousResult;
  }

  return {
    ...previousResult,
    viewer: {
      ...previousResult.viewer,
      repositories: {
        ...previousResult.viewer.repositories,
        ...fetchMoreResult.viewer.repositories,
        edges: [
          ...previousResult.viewer.repositories.edges,
          ...fetchMoreResult.viewer.repositories.edges,
        ],
      },
    },
  };
};

const getUpdateQuery =
  (entry) =>
  (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) {
      return previousResult;
    }

    return {
      ...previousResult,
      [entry]: {
        ...previousResult[entry],
        repositories: {
          ...previousResult[entry].repositories,
          ...fetchMoreResult[entry].repositories,
          edges: [
            ...previousResult[entry].repositories.edges,
            ...fetchMoreResult[entry].repositories.edges,
          ],
        },
      },
    };
  };

export const RepositoryList = ({ repositories, loading, fetchMore, entry }) => {
  return (
    <Fragment>
      {repositories.edges.map(({ node }) => (
        <div key={node.id} className="RepositoryItem">
          <RepositoryItem {...node} />
        </div>
      ))}
      <FetchMore
        loading={loading}
        hasNextPage={repositories.pageInfo.hasNextPage}
        variables={{
          cursor: repositories.pageInfo.endCursor,
        }}
        updateQuery={getUpdateQuery(entry)}
        fetchMore={fetchMore}
      />
    </Fragment>
  );
};
