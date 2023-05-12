import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

const TITLE = "React GraphQL GitHub";
const GET_ORGANIZATION = `
  {
    organization(login: "the-road-to-learn-react") {
      name
      url
    }
  }
`;

const GET_REPOSITORY_OF_ORGANIZATION = `
  {
    organization(login: "the-road-to-learn-react") {
      name
      url
      repository(name: "the-road-to-learn-react") {
        name
        url
      }
    }
  }
`;

const GET_ISSUES_OF_REPOSITORY = `
    query ($organization: String!, $repository: String!) {
      organization(login: $organization) {
        name
        url
        repository(name: $repository) {
          name
          url
          issues(last: 5) {
            edges {
              node {
                id
                title
                url
              }
            }
          }
        }
      }
    }
`;

const getIssuesOfRepositoryQuery = (organization, repository) => `
  {
    organization(login: "${organization}") {
      name
      url
      repository(name: "${repository}") {
        name
        url
        issues(last: 5) {
          edges {
            node {
              id
              title
              url
            }
          }
        }
      }
    }
  }
`;

const axiosGitHubGraphQL = axios.create({
  baseURL: "https://api.github.com/graphql",
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
});

const getIssuesOfRepository = async (path) => {
  const [organization, repository] = path.split("/");

  const result = await axiosGitHubGraphQL.post("", {
    query: GET_ISSUES_OF_REPOSITORY,
    variables: { organization, repository },
  });

  return result;
};

const App = () => {
  const [path, setPath] = useState(
    "the-road-to-learn-react/the-road-to-learn-react"
  );
  const [organization, setOrganization] = useState(null);
  const [errors, setErrors] = useState(null);

  useEffect(() => {}, []);

  const handleSubmit = (e) => {
    // fetch data
    e.preventDefault();
  };

  const handleChange = (e) => {
    setPath(e.target.value);
  };

  const handleFetchFromGitHub = async () => {
    const result = await getIssuesOfRepository(path);
    console.log(result);
    setOrganization(result.data.data.organization);
    setErrors(result?.data?.errors);
    return result;
  };

  useEffect(() => {
    // fetch data
    handleFetchFromGitHub(path);
  }, []);

  if (errors) {
    return (
      <p>
        <strong>Something went wrong:</strong>
        {errors.map((error) => error.message).join(" ")}
      </p>
    );
  }

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
      {organization ? (
        <Organization organization={organization} />
      ) : (
        <p>No information yet...</p>
      )}
    </div>
  );
};

const Organization = ({ organization }) => {
  return (
    <div>
      <p>
        <strong>Issues from Organization </strong>
        <a href={organization?.url} target="_blank">
          {organization?.name}
        </a>
        <Repository repository={organization.repository} />
      </p>
    </div>
  );
};

const Repository = ({ repository }) => {
  return (
    <div>
      <p>
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
        </li>
      ))}
    </div>
  );
};

export default App;
