import React, { useState } from "react";
import { Link, useLocation, useMatch } from "react-router-dom";
import * as routes from "../constants/routes";

export const Navigation = () => {
  return (
    <header className="Navigation">
      <div className="Navigation-link">
        <Link to={routes.PROFILE}>Profile</Link>
      </div>
      <div className="Navigation-link">
        <Link to={routes.ORGANIZATION}>Organization</Link>
      </div>
    </header>
  );
};
