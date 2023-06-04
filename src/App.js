import { useState, useEffect } from "react";
import "./App.css";
import { Profile } from "./Profile";
import { Organization } from "./Organization";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import * as routes from "../src/constants/routes";
import { Navigation } from "./Navigation";

const App = () => {
  const router = createBrowserRouter([
    {
      path: routes.HOME,
      element: <Navigation />,
    },
    {
      path: routes.PROFILE,
      element: <Profile />,
    },
    {
      path: routes.ORGANIZATION,
      element: <Organization organizationName={"taming-the-state-in-react"} />,
    },
  ]);

  useEffect(() => {}, []);

  return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
};

export default App;
