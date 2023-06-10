import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import "./style.css";
import { ErrorMessage } from "../../Error";
import { Loading } from "../../Loading";
import { IssueItem } from "../IssueItem";
import { ButtonUnobtrusive } from "../../Button";
import { FetchMore } from "../../Repository/FetchMore";
import { ApolloConsumer } from "@apollo/client";

const GET_ISSUES_OF_REPOSITORY = gql`
  query (
    $repositoryOwner: String!
    $repositoryName: String!
    $issueState: IssueState!
    $cursor: String
  ) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issues(first: 5, states: [$issueState], after: $cursor) {
        edges {
          node {
            id
            number
            state
            title
            url
            bodyHTML
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

const ISSUE_STATES = {
  NONE: "NONE",
  OPEN: "OPEN",
  CLOSED: "CLOSED",
};

const TRANSITION_LABELS = {
  [ISSUE_STATES.CLOSED]: "Show Open Issues",
  [ISSUE_STATES.OPEN]: "Show Closed Issues",
};

const TRANSITION_STATE = {
  [ISSUE_STATES.OPEN]: ISSUE_STATES.CLOSED,
  [ISSUE_STATES.CLOSED]: ISSUE_STATES.OPEN,
};

export const Issues = ({ repositoryOwner, repositoryName }) => {
  const [issueState, setIssueState] = useState(ISSUE_STATES.CLOSED);
  const [repositoryOwnerState, setRepositoryOwnerState] = useState("");
  const [repositoryNameState, setRepositoryNameState] = useState("");

  const { loading, error, data, fetchMore, client } = useQuery(
    GET_ISSUES_OF_REPOSITORY,
    {
      variables: {
        repositoryOwner,
        repositoryName,
        issueState,
      },
    }
  );

  if (error) {
    return <ErrorMessage error={error} />;
  }

  const isShow = (issueState) => issueState !== ISSUE_STATES.NONE;

  const updateQuery = (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) {
      return previousResult;
    }
    return {
      ...previousResult,
      repository: {
        ...previousResult.repository,
        issues: {
          ...previousResult.repository.issues,
          ...fetchMoreResult.repository.issues,
          edges: [
            ...previousResult.repository.issues.edges,
            ...fetchMoreResult.repository.issues.edges,
          ],
        },
      },
    };
  };

  const onChangeIssueState = (nextIssueState) => setIssueState(nextIssueState);

  const repository = data?.repository;
  console.log(`data: ${JSON.stringify(data?.repository)}`);

  if (loading && !repository) {
    return <Loading />;
  }

  const filteredRepository = {
    issues: {
      edges: repository?.issues?.edges.filter(
        (issue) => issue.node.state === issueState
      ),
    },
  };

  console.log(
    `filteredRepository edges: ${JSON.stringify(filteredRepository)}`
  );

  return (
    <IssueList
      onChangeIssueState={onChangeIssueState}
      issues={filteredRepository.issues}
      isShow={isShow}
      issueState={issueState}
      loading={loading}
      repositoryName={repositoryName}
      repositoryOwner={repositoryOwner}
      updateQuery={updateQuery}
      fetchMore={fetchMore}
      client={client}
    />
  );
};

const IssueList = ({
  issues,
  isShow,
  issueState,
  onChangeIssueState,
  loading,
  repositoryOwner,
  repositoryName,
  updateQuery,
  fetchMore,
  client,
}) => {
  const prefetchIssues = (client, repoOwner, repositoryName, issueState) => {
    console.log(`issueState: ${issueState}`);
    const nextIssueState = TRANSITION_STATE[issueState];
    console.log(`nextIssueState: ${nextIssueState}`);
    console.log(`owner: ${repoOwner}`);
    if (isShow(nextIssueState) && Boolean(repositoryOwner)) {
      client.query({
        query: GET_ISSUES_OF_REPOSITORY,
        variables: {
          repositoryOwner,
          repositoryName,
          issueState: nextIssueState,
        },
      });
    }
  };

  const repoOwner = repositoryOwner;
  console.log(`repositoryOwner 162: ${repositoryOwner}`);
  console.log(`repoOwner: ${repoOwner}`);

  return (
    <div className="IssueList">
      {repoOwner.length > 0 && (
        <IssueFilter
          repoOwner={repoOwner}
          repositoryName={repositoryName}
          issueState={issueState}
          onChangeIssueState={onChangeIssueState}
          prefetchIssues={prefetchIssues}
          client={client}
        />
      )}
      {isShow(issueState) &&
        issues.edges.map(({ node }) => (
          <IssueItem key={node.id} issue={node} />
        ))}
      <FetchMore
        loading={loading}
        hasNextPage={issues?.pageInfo?.hasNextPage}
        variablables={{
          cursor: issues?.pageInfo?.endCursor,
          repositoryOwner,
          repositoryName,
          issueState,
        }}
        updateQuery={updateQuery}
        fetchMore={fetchMore}>
        Issues
      </FetchMore>
    </div>
  );
};

const IssueFilter = ({
  issueState,
  onChangeIssueState,
  prefetchIssues,
  repoOwner,
  repositoryName,
  client,
}) => {
  console.log(`repositoryOwner 200: ${repoOwner}`);
  console.log(`repositoryName: ${repositoryName}`);

  const handlePrefetchIssues = (
    client,
    repoOwner,
    repositoryName,
    issueState
  ) => {
    console.log(`repoOwner: ${repoOwner}`);
    if (repoOwner) {
      prefetchIssues(client, repoOwner, repositoryName, issueState);
    }
  };

  return (
    <ButtonUnobtrusive
      onClick={() => onChangeIssueState(TRANSITION_STATE[issueState])}
      onMouseOver={() =>
        handlePrefetchIssues(client, repoOwner, repositoryName, issueState)
      }>
      {TRANSITION_LABELS[issueState]}
    </ButtonUnobtrusive>
  );
};
