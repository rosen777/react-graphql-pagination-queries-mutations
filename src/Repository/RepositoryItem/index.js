import React from "react";
import { Link } from "../../Link";
import { useMutation, gql } from "@apollo/client";
import Button from "../../Button";
import { REPOSITORY_FRAGMENT } from "../fragments";

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

const UNSTAR_REPOSITORY = gql`
  mutation ($id: ID!) {
    removeStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const WATCH_REPOSITORY = gql`
  mutation ($id: ID!, $viewerSubscription: SubscriptionState!) {
    updateSubscription(
      input: { state: $viewerSubscription, subscribableId: $id }
    ) {
      subscribable {
        id
        viewerSubscription
      }
    }
  }
`;

const VIEWER_SUBSCRIPTIONS = {
  SUBSCRIBED: "SUBSCRIBED",
  UNSUBSCRIBED: "UNSUBSCRIBED",
};

const isWatch = (viewerSubscription) =>
  viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED;

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
  const [addStar, { data, loading, error }] = useMutation(STAR_REPOSITORY, {
    updateAddStar(
      cache,
      {
        data: {
          addStar: {
            starrable: { id, viewerHasStarred },
          },
        },
      }
    ) {
      cache.modify({
        id: `Repository:${id}`,
        fields: {
          stars(existingStarts = []) {
            const newStarRef = cache.writeFragment({
              id,
              data: getUpdatedStarData(cache, id, viewerHasStarred),
              fragment: REPOSITORY_FRAGMENT,
            });
            return [...existingStarts, newStarRef];
          },
        },
      });
    },
  });

  const getUpdatedStarData = (cache, id, viewerHasStarred) => {
    const repository = cache.readFragment({
      id: `Repository:${id}`,
      fragment: REPOSITORY_FRAGMENT,
    });

    let { totalCount } = repository.stargazers;
    totalCount = viewerHasStarred ? totalCount + 1 : totalCount - 1;

    return {
      ...repository,
      stargazers: {
        ...repository.stargazers,
        totalCount,
      },
    };
  };

  const [removeStar, { removeStarData, removeStarLoading, removeStarError }] =
    useMutation(UNSTAR_REPOSITORY);
  const [updateSubscription, { updateData, updateLoading, updateError }] =
    useMutation(WATCH_REPOSITORY);

  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  return (
    <div>
      <div className="RepositoryItem-title">
        <h2>
          <Link href={url}>{name}</Link>
        </h2>

        <div>
          <Button
            className="RepositoryItem-title-action"
            data-test-id="updateSubscription"
            onClick={() =>
              updateSubscription({
                variables: {
                  id,
                  viewerSubscription: isWatch(viewerSubscription)
                    ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
                    : VIEWER_SUBSCRIPTIONS.SUBSCRIBED,
                },
              })
            }>
            {watchers.totalCount}{" "}
            {isWatch(viewerSubscription) ? "Unwatch" : "Watch"}
          </Button>
          {!viewerHasStarred ? (
            <Button
              className="RepositoryItem-title-action"
              onClick={() =>
                addStar({
                  variables: {
                    id,
                  },
                  optimisticResponse: {
                    addStar: {
                      id,
                      __typename: "Mutation",
                      starrable: {
                        __typename: "Repository",
                        id,
                        viewerHasStarred: !viewerHasStarred,
                      },
                    },
                  },
                })
              }>
              {stargazers.totalCount} Stars
            </Button>
          ) : (
            <Button
              className="RepositoryItem-title-action"
              onClick={() =>
                removeStar({
                  variables: {
                    id,
                  },
                  optimisticResponse: {
                    removeStar: {
                      __typename: "Mutation",
                      starrable: {
                        __typename: "Repository",
                        id,
                        viewerHasStarred: !viewerHasStarred,
                      },
                    },
                  },
                })
              }>
              {stargazers.totalCount} Unstar
            </Button>
          )}
          {/* Here comes your updateSubscription mutation */}
        </div>
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
