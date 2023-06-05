import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import "./style.css";
import { ErrorMessage } from "../../Error";
import { Loading } from "../../Loading";
import { IssueItem } from "../IssueItem";
import { ButtonUnobtrusive } from "../../Button";

const GET_ISSUES_OF_REPOSITORY = gql`
  query ($repositoryOwner: String!, $repositoryName: String!) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issues(first: 5) {
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
  [ISSUE_STATES.NONE]: "Show Open Issues",
  [ISSUE_STATES.OPEN]: "Show Closed Issues",
  [ISSUE_STATES.CLOSED]: "Hide Issues",
};

const TRANSITION_STATE = {
  [ISSUE_STATES.NONE]: ISSUE_STATES.OPEN,
  [ISSUE_STATES.OPEN]: ISSUE_STATES.CLOSED,
  [ISSUE_STATES.CLOSED]: ISSUE_STATES.NONE,
};

export const Issues = ({ repositoryOwner, repositoryName }) => {
  const { loading, error, data } = useQuery(GET_ISSUES_OF_REPOSITORY, {
    variables: { repositoryOwner, repositoryName },
  });
  const [issueState, setIssueState] = useState(ISSUE_STATES.NONE);
  const [repositoryOwnerState, setRepositoryOwnerState] = useState("");
  const [repositoryNameState, setRepositoryNameState] = useState("");

  if (error) {
    return <ErrorMessage error={error} />;
  }

  const isShow = (issueState) => issueState !== ISSUE_STATES.NONE;

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
    />
  );
};

const IssueList = ({ issues, isShow, issueState, onChangeIssueState }) => {
  return (
    <div className="IssueList">
      <ButtonUnobtrusive
        onClick={() => onChangeIssueState(TRANSITION_STATE[issueState])}>
        {TRANSITION_STATE[issueState]}
      </ButtonUnobtrusive>
      {isShow(issueState) &&
        issues.edges.map(({ node }) => (
          <IssueItem key={node.id} issue={node} />
        ))}
    </div>
  );
};
