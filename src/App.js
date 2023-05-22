import { useState, useEffect } from "react";
import "./App.css";
import { Profile } from "./Profile";

const App = () => {
  const [path, setPath] = useState(
    "the-road-to-learn-react/the-road-to-learn-react"
  );
  const [organization, setOrganization] = useState(null);
  const [errors, setErrors] = useState(null);

  useEffect(() => {}, []);

  return (
    <div className="App">
      <Profile />
    </div>
  );
};

const Organization = ({ organization }) => {
  return (
    <div>
      {/* <p>
        <strong>Issues from Organization </strong>
        <a href={organization?.url} target="_blank">
          {organization?.name}
        </a>
        <Repository repository={organization.repository} />
      </p> */}
    </div>
  );
};

const Repository = ({ repository, onFetchMoreIssues }) => {
  return (
    <div>
      {/* <p>
        <strong>In Repository: </strong>
        <a href={repository?.url} target="_blank">
          {repository?.name}
        </a>
      </p>
      {repository.issues.edges.map((issue) => (
        <li key={issue.node.id}>
          <a href={issue.node.url} target="_blank">
            {issue.node.title}
          </a>
          <ul>
            {issue.node.reactions.edges.map((reaction) => (
              <li key={reaction.node.id}>{reaction.node.current}</li>
            ))}
          </ul>
          <hr />
          {repository.issues.pageInfo.hasNextPage && (
            <button onClick={onFetchMoreIssues}>More</button>
          )}
        </li>
      ))} */}
    </div>
  );
};

export default App;
