import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Loading } from "./Loading";

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    viewer {
      login
      name
    }
  }
`;

export const Profile = () => {
  const { loading, error, data } = useQuery(GET_CURRENT_USER);
  const viewer = data?.viewer;
  console.log(`Profile Data: ${JSON.stringify(data)}`);

  if (loading || !viewer) return <Loading />;
  if (error) return `Error: ${error.message}`;

  return (
    <div>
      {viewer.name} {viewer.login}
    </div>
  );
};
