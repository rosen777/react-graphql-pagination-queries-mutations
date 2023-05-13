import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

const TITLE = "React GraphQL GitHub";

const GET_ISSUES_OF_REPOSITORY = `
    query (
      $organization: String!, 
      $repository: String!,
      $cursor: String
    ) {
      organization(login: $organization) {
        name
        url
        repository(name: $repository) {
          name
          url
          issues(first: 5, after: $cursor, states: [OPEN]) {
            edges {
              node {
                id
                title
                url
                reactions(last: 3) {
                  edges {
                    node {
                      id
                      content
                    }
                  }
                }
              }
            }
            totalCount
            pageInfo {
              endCursor
              hasNextPage
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

const getIssuesOfRepository = async (path, cursor) => {
  const [organization, repository] = path.split("/");

  const result = await axiosGitHubGraphQL.post("", {
    query: GET_ISSUES_OF_REPOSITORY,
    variables: { organization, repository, cursor },
  });

  return result;
};

const resolveIssuesQuery = (queryResult, cursor) => (state) => {
  const { data, errors } = queryResult.data;

  if (!cursor) {
    return {
      organization: data.organization,
      errors,
    };
  }

  const { edges: oldIssues } = state.organization.repository.issues;
  const { edges: newIssues } = data.organization.repository.issues;
  const updatedIssues = [...oldIssues, ...newIssues];

  return {
    organization: {
      ...data.organization,
      respository: {
        ...data.organization.repository,
        issues: {
          ...data.organization.issues,
          edges: updatedIssues,
        },
      },
    },
    errors,
  };
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
    handleFetchFromGitHub(path);
    e.preventDefault();
  };

  const handleChange = (e) => {
    setPath(e.target.value);
  };

  const handleFetchFromGitHub = async (path, cursor) => {
    const result = await getIssuesOfRepository(path, cursor);
    setOrganization(result.data.data.organization);
    setErrors(result?.data?.errors);
    return result;
  };

  const onFetchMoreIssues = () => {
    const { endCursor } = organization.repository.issues.pageInfo;
    handleFetchFromGitHub(path, endCursor);
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
        <Organization
          organization={organization}
          onFetchMoreIssues={onFetchMoreIssues}
        />
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

const Repository = ({ repository, onFetchMoreIssues }) => {
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
      ))}
    </div>
  );
};

export default App;
