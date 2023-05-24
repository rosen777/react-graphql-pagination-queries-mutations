import React from "react";
import { Link } from "../../Link";
import { useMutation, gql } from "@apollo/client";
import Button from "../../Button";

import "../style.css";

const STAR_REPOSITORY = gql`
  mutation ($id: ID!) {
    addStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

export const RepositoryItem = ({
  id,
  name,
  url,
  descriptionHTML,
  primaryLanguage,
  owner,
  stargazers,
  watchers,
  viewerSubscription,
  viewerHasStarred,
}) => {
  const [addStar, { data, loading, error }] = useMutation(STAR_REPOSITORY);

  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  return (
    <div>
      <div className="RepositoryItem-title">
        <h2>
          <Link href={url}>{name}</Link>
        </h2>
        {!viewerHasStarred ? (
          <Button
            className="RepositoryItem-title-action"
            onClick={() =>
              addStar({
                variables: {
                  id,
                },
              })
            }>
            {stargazers.totalCount} Stars
          </Button>
        ) : (
          <span>{/* Here comes your removeStar mutation */}</span>
        )}
        {/* Here comes your updateSubscription mutation */}
      </div>

      <div className="RepositoryItem-description">
        <div
          className="RepositoryItem-description-info"
          dangerouslySetInnerHTML={{ __html: descriptionHTML }}
        />
        <div className="RepositoryItem-description-details">
          <div>
            {primaryLanguage && <span>Language: {primaryLanguage.name}</span>}
          </div>
          <div>
            {owner && (
              <span>
                Owner: <a href={owner.url}>{owner.login}</a>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
