import React, { useState } from "react";
import { Input } from "../Input";
import Button from "../Button";

export const OrganizationSearch = ({
  organizationName,
  onOrganizationSearch,
}) => {
  const [orgName, setOrgName] = useState(organizationName);
  const onChange = (event) => {
    setOrgName(event.target.value);
  };
  const onSubmit = (event) => {
    onOrganizationSearch(orgName);
    event.preventDefault();
  };
  return (
    <div
      className="Navigation-search"
      style={{ flex: 1, display: "flex", flexDirection: "row" }}>
      <form onSubmit={onSubmit}>
        <Input
          color={"white"}
          type="text"
          value={orgName}
          onChange={onChange}
        />{" "}
        <Button
          style={{
            backgroundColor: "white",
            borderColor: "black",
            borderWidth: 1,
            marginTop: 10,
          }}
          type="submit">
          Search
        </Button>
      </form>
    </div>
  );
};
