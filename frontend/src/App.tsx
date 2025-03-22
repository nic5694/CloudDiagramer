import { useEffect, useState } from "react";
import "./App.css";
import { ProjectInterface } from "./model/projectInterface";

const GOOGLE_CLIENT_ID =
  "463934685941-85t1csm80b9apqgp91prph9d4k3jbmks.apps.googleusercontent.com";
const REDIRECT_URI = window.location.origin;
const SCOPE = "https://www.googleapis.com/auth/cloud-platform";

function App() {
  const [projectList, setProjectList] = useState<ProjectInterface[]>([]);
  const [selectedProject, setSelectedProject] =
    useState<ProjectInterface | null>(null);

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("google_access_token")
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check for token in URL hash on page load
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Extract token from hash
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      if (accessToken) {
        console.log("Access token found in URL:", accessToken);
        setToken(accessToken);
        localStorage.setItem("google_access_token", accessToken);

        // Clean the URL by removing the hash
        window.history.pushState("", document.title, window.location.pathname);

        // Fetch projects with the new token
        fetchProjects(accessToken);
      }
    } else if (token) {
      // Use existing token if available
      fetchProjects(token);
    }
  }, []);

  const handleLogin = () => {
    // Google's OAuth 2.0 endpoint for requesting an access token
    const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

    // Parameters to pass to OAuth 2.0 endpoint
    const params = {
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: "token",
      scope: SCOPE,
      include_granted_scopes: "true",
      state: "pass-through-value",
    };

    // Build the authorization URL
    const authUrl = `${oauth2Endpoint}?${new URLSearchParams(
      params
    ).toString()}`;

    // Redirect to Google's OAuth page
    window.location.href = authUrl;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setProjectList([]);
    localStorage.removeItem("google_access_token");
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const projectNumber = e.target.value;
    const project =
      projectList.find((p) => p.projectNumber === projectNumber) || null;
    setSelectedProject(project);
  };

  const fetchProjects = async (accessToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://cloudresourcemanager.googleapis.com/v1/projects",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Project data:", data);

      if (data.projects) {
        const formattedProjects = data.projects.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (project: any) => ({
            projectName: project.name,
            projectNumber: project.projectNumber,
            projectId: project.projectId,
          })
        );
        setProjectList(formattedProjects);

        // Set the first project as selected by default if there are projects
        if (formattedProjects.length > 0) {
          setSelectedProject(formattedProjects[0]);
        }
      } else {
        setProjectList([]);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to fetch projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>GCP Diagrammer</h1>

      {!token ? (
        <div className="login-section">
          <p>Please sign in to access your Google Cloud projects</p>
          <button onClick={handleLogin} className="login-button">
            Sign in with Google
          </button>
        </div>
      ) : (
        <div className="projects-section">
          <div className="header">
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>

          {loading ? (
            <p>Loading projects...</p>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : projectList.length > 0 ? (
            <div className="project-selection">
              <h2>Your Projects</h2>
              <div className="combobox-container">
                <label htmlFor="project-select">Select a project:</label>
                <select
                  id="project-select"
                  value={selectedProject?.projectNumber || ""}
                  onChange={handleProjectChange}
                  className="project-combobox"
                >
                  {projectList.map((project) => (
                    <option
                      key={project.projectNumber}
                      value={project.projectNumber}
                    >
                      {project.projectName}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProject && (
                <div className="project-details">
                  <h3>Selected Project Details</h3>
                  <p>
                    <strong>Name:</strong> {selectedProject.projectName}
                  </p>
                  <p>
                    <strong>Project Number:</strong>{" "}
                    {selectedProject.projectNumber}
                  </p>
                  <button
                    className="view-resources-button"
                    onClick={() => {
                      // You can implement a function to view the project's resources
                      console.log(
                        "View resources for project:",
                        selectedProject
                      );
                    }}
                  >
                    View Resources
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p>No projects found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
