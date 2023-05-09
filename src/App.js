import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
const TITLE = "React GraphQL GitHub";

const axiosGitHubGraphQL = axios.create({
  baseURL: "https://api.github.com/graphql",
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
});

const App = () => {
  const [path, setPath] = useState(
    "the-road-to-learn-react/the-road-to-learn-react"
  );

  useEffect(() => {
    // fetch data
  }, []);

  const handleSubmit = (e) => {
    // fetch data
    e.preventDefault();
  };

  const handleChange = (e) => {
    setPath(e.target.value);
  };

  return (
    <div className="App">
      <h1>{TITLE}</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="url">Show open issues for https://github.com/</label>
        <input
          id="url"
          type="text"
          value={path}
          onChange={handleChange}
          style={{ width: "300px" }}
        />
        <button type="submit">Search</button>
      </form>
      <hr />
    </div>
  );
};

export default App;
