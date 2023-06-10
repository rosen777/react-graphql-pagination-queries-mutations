import React from "react";
import { Loading } from "../../Loading";
import "./style.css";
import { ButtonUnobtrusive } from "../../Button";

export const FetchMore = ({
  loading,
  variables,
  updateQuery,
  fetchMore,
  children,
}) => (
  <div className="FetchMore">
    {loading ? (
      <Loading />
    ) : (
      <ButtonUnobtrusive
        type="button"
        className="FetchMore-button"
        onClick={() => fetchMore({ variables, updateQuery })}>
        More {children}
      </ButtonUnobtrusive>
    )}
  </div>
);
