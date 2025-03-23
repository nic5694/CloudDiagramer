// // import { useEffect, useState } from "react";
// // import "./App.css";
// // import { ProjectInterface } from "./model/projectInterface";

// // const GOOGLE_CLIENT_ID =
// //   "463934685941-85t1csm80b9apqgp91prph9d4k3jbmks.apps.googleusercontent.com";
// // const REDIRECT_URI = window.location.origin;
// // const SCOPE = "https://www.googleapis.com/auth/cloud-platform";
// // const API_BASE_URL =
// //   "https://frontendgcpdiagrammer-463934685941.northamerica-northeast2.run.app";

// // function App() {
// //   const [projectList, setProjectList] = useState<ProjectInterface[]>([]);
// //   const [selectedProject, setSelectedProject] =
// //     useState<ProjectInterface | null>(null);

// //   const [token, setToken] = useState<string | null>(
// //     localStorage.getItem("google_access_token")
// //   );
// //   // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
// //   const [, setUser] = useState<any>(null);
// //   const [loading, setLoading] = useState<boolean>(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const [diagramUrl, setDiagramUrl] = useState<string | null>(null);
// //   const [diagramLoading, setDiagramLoading] = useState<boolean>(false);
// //   const [diagramError, setDiagramError] = useState<string | null>(null);

// //   setDiagramLoading(false);
// //   setDiagramError(null);
// //   setDiagramUrl(null);
// //   // Check for token in URL hash on page load
// //   useEffect(() => {
// //     const hash = window.location.hash;
// //     if (hash) {
// //       // Extract token from hash
// //       const params = new URLSearchParams(hash.substring(1));
// //       const accessToken = params.get("access_token");
// //       if (accessToken) {
// //         console.log("Access token found in URL:", accessToken);
// //         setToken(accessToken);
// //         localStorage.setItem("google_access_token", accessToken);

// //         // Clean the URL by removing the hash
// //         window.history.pushState("", document.title, window.location.pathname);

// //         // Fetch projects with the new token
// //         fetchProjects(accessToken);
// //       }
// //     } else if (token) {
// //       // Use existing token if available
// //       fetchProjects(token);
// //     }
// //   }, []);

// //   const handleLogin = () => {
// //     // Google's OAuth 2.0 endpoint for requesting an access token
// //     const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

// //     // Parameters to pass to OAuth 2.0 endpoint
// //     const params = {
// //       client_id: GOOGLE_CLIENT_ID,
// //       redirect_uri: REDIRECT_URI,
// //       response_type: "token",
// //       scope: SCOPE,
// //       include_granted_scopes: "true",
// //       state: "pass-through-value",
// //     };

// //     // Build the authorization URL
// //     const authUrl = `${oauth2Endpoint}?${new URLSearchParams(
// //       params
// //     ).toString()}`;

// //     // Redirect to Google's OAuth page
// //     window.location.href = authUrl;
// //   };

// //   const logout = () => {
// //     setToken(null);
// //     setUser(null);
// //     setProjectList([]);
// //     localStorage.removeItem("google_access_token");
// //   };

// //   const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// //     const projectNumber = e.target.value;
// //     const project =
// //       projectList.find((p) => p.projectNumber === projectNumber) || null;
// //     setSelectedProject(project);
// //   };

// //   const generateDiagram = async () => {
// //     if (!selectedProject || !token) return;

// //     setDiagramLoading(true);
// //     setDiagramError(null);
// //     setDiagramUrl(null);

// //     try {
// //       // Call the backend API to generate the diagram
// //       const response = await fetch(
// //         `${API_BASE_URL}/projects/${selectedProject.projectId}/generatepuml`,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         }
// //       );

// //       if (!response.ok) {
// //         throw new Error(`Failed to generate diagram: ${response.status}`);
// //       }

// //       // Assuming the backend returns a URL to view the diagram
// //       const data = await response.json();

// //       if (data.imageUrl) {
// //         setDiagramUrl(data.imageUrl);
// //       } else {
// //         setDiagramError("No diagram URL returned from the server");
// //       }
// //     } catch (err) {
// //       console.error("Error generating diagram:", err);
// //       setDiagramError("Failed to generate diagram. Please try again.");
// //     } finally {
// //       setDiagramLoading(false);
// //     }
// //   };

// //   const fetchProjects = async (accessToken: string) => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const response = await fetch(
// //         "https://cloudresourcemanager.googleapis.com/v1/projects",
// //         {
// //           headers: {
// //             Authorization: `Bearer ${accessToken}`,
// //             Accept: "application/json",
// //           },
// //         }
// //       );

// //       if (!response.ok) {
// //         throw new Error(`API error: ${response.status}`);
// //       }

// //       const data = await response.json();
// //       console.log("Project data:", data);

// //       if (data.projects) {
// //         const formattedProjects = data.projects.map(
// //           // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //           (project: any) => ({
// //             projectName: project.name,
// //             projectNumber: project.projectNumber,
// //             projectId: project.projectId,
// //           })
// //         );
// //         setProjectList(formattedProjects);

// //         // Set the first project as selected by default if there are projects
// //         if (formattedProjects.length > 0) {
// //           setSelectedProject(formattedProjects[0]);
// //         }
// //       } else {
// //         setProjectList([]);
// //       }
// //     } catch (err) {
// //       console.error("Error fetching projects:", err);
// //       setError("Failed to fetch projects. Please try again.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="app-container">
// //       <h1>GCP Diagrammer</h1>

// //       {!token ? (
// //         <div className="login-section">
// //           <p>Please sign in to access your Google Cloud projects</p>
// //           <button onClick={handleLogin} className="login-button">
// //             Sign in with Google
// //           </button>
// //         </div>
// //       ) : (
// //         <div className="projects-section">
// //           <div className="header">
// //             <button onClick={logout} className="logout-button">
// //               Logout
// //             </button>
// //           </div>

// //           {loading ? (
// //             <p>Loading projects...</p>
// //           ) : error ? (
// //             <div className="error-message">{error}</div>
// //           ) : projectList.length > 0 ? (
// //             <div className="project-selection">
// //               <h2>Your Projects</h2>
// //               <div className="combobox-container">
// //                 <label htmlFor="project-select">Select a project:</label>
// //                 <select
// //                   id="project-select"
// //                   value={selectedProject?.projectNumber || ""}
// //                   onChange={handleProjectChange}
// //                   className="project-combobox"
// //                 >
// //                   {projectList.map((project) => (
// //                     <option
// //                       key={project.projectNumber}
// //                       value={project.projectNumber}
// //                     >
// //                       {project.projectName}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>

// //               {selectedProject && (
// //                 <div className="project-details">
// //                   <h3>Selected Project Details</h3>
// //                   <p>
// //                     <strong>Name:</strong> {selectedProject.projectName}
// //                   </p>
// //                   <p>
// //                     <strong>Project Number:</strong>{" "}
// //                     {selectedProject.projectNumber}
// //                   </p>
// //                   <button
// //                     className="view-resources-button"
// //                     onClick={() => {
// //                       // You can implement a function to view the project's resources

// //                       console.log(
// //                         "View resources for project:",
// //                         selectedProject
// //                       );
// //                     }}
// //                   >
// //                     View Resources
// //                   </button>
// //                 </div>
// //               )}
// //             </div>
// //           ) : (
// //             <p>No projects found</p>
// //           )}
// //         </div>
// //       )}
// //       {selectedProject && (
// //         <div className="project-details">
// //           <h3>Selected Project Details</h3>
// //           <p>
// //             <strong>Name:</strong> {selectedProject.projectName}
// //           </p>
// //           <p>
// //             <strong>Project Number:</strong> {selectedProject.projectNumber}
// //           </p>
// //           <button
// //             className="view-resources-button"
// //             onClick={generateDiagram}
// //             disabled={diagramLoading}
// //           >
// //             {diagramLoading ? "Generating..." : "View Resources Diagram"}
// //           </button>

// //           {diagramError && <div className="error-message">{diagramError}</div>}

// //           {diagramUrl && (
// //             <div className="diagram-container">
// //               <h4>Resource Diagram</h4>
// //               <div className="diagram-wrapper">
// //                 <img
// //                   src={diagramUrl}
// //                   alt="Resource Diagram"
// //                   className="resource-diagram"
// //                 />
// //               </div>
// //               <a
// //                 href={diagramUrl}
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //                 className="open-diagram-button"
// //               >
// //                 Open in New Tab
// //               </a>
// //             </div>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// // export default App;
// // import { useEffect, useState } from "react";
// // import "./App.css";
// // import { ProjectInterface } from "./model/projectInterface";

// // const GOOGLE_CLIENT_ID =
// //   "463934685941-85t1csm80b9apqgp91prph9d4k3jbmks.apps.googleusercontent.com";
// // const REDIRECT_URI = window.location.origin + "/auth/callback";
// // const SCOPE = "https://www.googleapis.com/auth/cloud-platform";
// // const API_BASE_URL = "http://localhost:8000";

// // function App() {
// //   const [projectList, setProjectList] = useState<ProjectInterface[]>([]);
// //   const [selectedProject, setSelectedProject] =
// //     useState<ProjectInterface | null>(null);

// //   const [token, setToken] = useState<string | null>(
// //     localStorage.getItem("google_access_token")
// //   );
// //   // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
// //   const [, setUser] = useState<any>(null);
// //   const [loading, setLoading] = useState<boolean>(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const [diagramUrl, setDiagramUrl] = useState<string | null>(null);
// //   const [diagramLoading, setDiagramLoading] = useState<boolean>(false);
// //   const [diagramError, setDiagramError] = useState<string | null>(null);

// //   // Check for token in URL hash on page load
// //   useEffect(() => {
// //     // Reset diagram state on component mount
// //     setDiagramLoading(false);
// //     setDiagramError(null);
// //     setDiagramUrl(null);

// //     const hash = window.location.hash;
// //     if (hash) {
// //       // Extract token from hash
// //       const params = new URLSearchParams(hash.substring(1));
// //       const accessToken = params.get("access_token");
// //       if (accessToken) {
// //         console.log("Access token found in URL:", accessToken);
// //         setToken(accessToken);
// //         localStorage.setItem("google_access_token", accessToken);

// //         // Clean the URL by removing the hash
// //         window.history.pushState("", document.title, window.location.pathname);

// //         // Fetch projects with the new token
// //         fetchProjects(accessToken);
// //       }
// //     } else if (token) {
// //       // Use existing token if available
// //       fetchProjects(token);
// //     }
// //   }, []);

// //   const handleLogin = () => {
// //     // Google's OAuth 2.0 endpoint for requesting an access token
// //     const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

// //     // Parameters to pass to OAuth 2.0 endpoint
// //     const params = {
// //       client_id: GOOGLE_CLIENT_ID,
// //       redirect_uri: REDIRECT_URI,
// //       response_type: "token",
// //       scope: SCOPE,
// //       include_granted_scopes: "true",
// //       state: "pass-through-value",
// //     };

// //     // Build the authorization URL
// //     const authUrl = `${oauth2Endpoint}?${new URLSearchParams(
// //       params
// //     ).toString()}`;

// //     // Redirect to Google's OAuth page
// //     window.location.href = authUrl;
// //   };

// //   const logout = () => {
// //     setToken(null);
// //     setUser(null);
// //     setProjectList([]);
// //     setSelectedProject(null);
// //     setDiagramUrl(null);
// //     localStorage.removeItem("google_access_token");
// //   };

// //   const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// //     const projectNumber = e.target.value;
// //     const project =
// //       projectList.find((p) => p.projectNumber === projectNumber) || null;
// //     setSelectedProject(project);

// //     // Reset diagram state when project changes
// //     setDiagramUrl(null);
// //     setDiagramError(null);
// //   };

// //   const generateDiagram = async () => {
// //     if (!selectedProject || !token) return;

// //     setDiagramLoading(true);
// //     setDiagramError(null);
// //     setDiagramUrl(null);

// //     try {
// //       // Call the backend API to generate the diagram
// //       const response = await fetch(
// //         `${API_BASE_URL}/projects/${selectedProject.projectId}/generatepuml`,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         }
// //       );

// //       if (!response.ok) {
// //         throw new Error(`Failed to generate diagram: ${response.status}`);
// //       }

// //       // Assuming the backend returns a URL to view the diagram
// //       const data = await response.json();

// //       if (data.imageUrl) {
// //         setDiagramUrl(data.imageUrl);
// //       } else {
// //         setDiagramError("No diagram URL returned from the server");
// //       }
// //     } catch (err) {
// //       console.error("Error generating diagram:", err);
// //       setDiagramError("Failed to generate diagram. Please try again.");
// //     } finally {
// //       setDiagramLoading(false);
// //     }
// //   };

// //   const fetchProjects = async (accessToken: string) => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const response = await fetch(
// //         "https://cloudresourcemanager.googleapis.com/v1/projects",
// //         {
// //           headers: {
// //             Authorization: `Bearer ${accessToken}`,
// //             Accept: "application/json",
// //           },
// //         }
// //       );

// //       if (!response.ok) {
// //         throw new Error(`API error: ${response.status}`);
// //       }

// //       const data = await response.json();
// //       console.log("Project data:", data);

// //       if (data.projects) {
// //         const formattedProjects = data.projects.map(
// //           // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //           (project: any) => ({
// //             projectName: project.name,
// //             projectNumber: project.projectNumber,
// //             projectId: project.projectId,
// //           })
// //         );
// //         setProjectList(formattedProjects);

// //         // Set the first project as selected by default if there are projects
// //         if (formattedProjects.length > 0) {
// //           setSelectedProject(formattedProjects[0]);
// //         }
// //       } else {
// //         setProjectList([]);
// //       }
// //     } catch (err) {
// //       console.error("Error fetching projects:", err);
// //       setError("Failed to fetch projects. Please try again.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="app-container">
// //       <h1>GCP Diagrammer</h1>

// //       {!token ? (
// //         <div className="login-section">
// //           <p>Please sign in to access your Google Cloud projects</p>
// //           <button onClick={handleLogin} className="login-button">
// //             Sign in with Google
// //           </button>
// //         </div>
// //       ) : (
// //         <div className="projects-section">
// //           <div className="header">
// //             <button onClick={logout} className="logout-button">
// //               Logout
// //             </button>
// //           </div>

// //           {loading ? (
// //             <p>Loading projects...</p>
// //           ) : error ? (
// //             <div className="error-message">{error}</div>
// //           ) : projectList.length > 0 ? (
// //             <div className="project-selection">
// //               <h2>Your Projects</h2>
// //               <div className="combobox-container">
// //                 <label htmlFor="project-select">Select a project:</label>
// //                 <select
// //                   id="project-select"
// //                   value={selectedProject?.projectNumber || ""}
// //                   onChange={handleProjectChange}
// //                   className="project-combobox"
// //                 >
// //                   {projectList.map((project) => (
// //                     <option
// //                       key={project.projectNumber}
// //                       value={project.projectNumber}
// //                     >
// //                       {project.projectName}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>

// //               {selectedProject && (
// //                 <div className="project-details">
// //                   <h3>Selected Project Details</h3>
// //                   <p>
// //                     <strong>Name:</strong> {selectedProject.projectName}
// //                   </p>
// //                   <p>
// //                     <strong>Project Number:</strong>{" "}
// //                     {selectedProject.projectNumber}
// //                   </p>
// //                   <button
// //                     className="view-resources-button"
// //                     onClick={generateDiagram}
// //                     disabled={diagramLoading}
// //                   >
// //                     {diagramLoading
// //                       ? "Generating..."
// //                       : "View Resources Diagram"}
// //                   </button>

// //                   {diagramError && (
// //                     <div className="error-message">{diagramError}</div>
// //                   )}

// //                   {diagramUrl && (
// //                     <div className="diagram-container">
// //                       <h4>Resource Diagram</h4>
// //                       <div className="diagram-wrapper">
// //                         <img
// //                           src={diagramUrl}
// //                           alt="Resource Diagram"
// //                           className="resource-diagram"
// //                         />
// //                       </div>
// //                       <a
// //                         href={diagramUrl}
// //                         target="_blank"
// //                         rel="noopener noreferrer"
// //                         className="open-diagram-button"
// //                       >
// //                         Open in New Tab
// //                       </a>
// //                     </div>
// //                   )}
// //                 </div>
// //               )}
// //             </div>
// //           ) : (
// //             <p>No projects found</p>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default App;

// import { useEffect, useState } from "react";
// import "./App.css";
// import { ProjectInterface } from "./model/projectInterface";
// // import axios from "axios";

// const GOOGLE_CLIENT_ID =
//   "463934685941-85t1csm80b9apqgp91prph9d4k3jbmks.apps.googleusercontent.com";
// const REDIRECT_URI = window.location.origin;
// const SCOPE = "https://www.googleapis.com/auth/cloud-platform";
// const API_BASE_URL = "http://localhost:8000";

// function App() {
//   const [projectList, setProjectList] = useState<ProjectInterface[]>([]);
//   const [selectedProject, setSelectedProject] =
//     useState<ProjectInterface | null>(null);

//   const [token, setToken] = useState<string | null>(
//     localStorage.getItem("google_access_token")
//   );
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
//   const [, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [diagramUrl, setDiagramUrl] = useState<string | null>(null);
//   const [diagramLoading, setDiagramLoading] = useState<boolean>(false);
//   const [diagramError, setDiagramError] = useState<string | null>(null);

//   // Check for token in URL hash on page load
//   useEffect(() => {
//     // Reset diagram state on component mount
//     setDiagramLoading(false);
//     setDiagramError(null);
//     setDiagramUrl(null);

//     const hash = window.location.hash;
//     if (hash) {
//       // Extract token from hash
//       const params = new URLSearchParams(hash.substring(1));
//       const accessToken = params.get("access_token");
//       if (accessToken) {
//         console.log("Access token found in URL:", accessToken);
//         setToken(accessToken);
//         localStorage.setItem("google_access_token", accessToken);

//         // Clean the URL by removing the hash
//         window.history.pushState("", document.title, window.location.pathname);

//         // Fetch projects with the new token
//         fetchProjects(accessToken);
//       }
//     } else if (token) {
//       // Use existing token if available
//       fetchProjects(token);
//     }
//   }, []);

//   const handleLogin = () => {
//     // Google's OAuth 2.0 endpoint for requesting an access token
//     const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

//     // Parameters to pass to OAuth 2.0 endpoint
//     const params = {
//       client_id: GOOGLE_CLIENT_ID,
//       redirect_uri: REDIRECT_URI,
//       response_type: "token",
//       scope: SCOPE,
//       include_granted_scopes: "true",
//       state: "pass-through-value",
//     };

//     // Build the authorization URL
//     const authUrl = `${oauth2Endpoint}?${new URLSearchParams(
//       params
//     ).toString()}`;

//     // Redirect to Google's OAuth page
//     window.location.href = authUrl;
//   };

//   const logout = () => {
//     setToken(null);
//     setUser(null);
//     setProjectList([]);
//     setSelectedProject(null);
//     setDiagramUrl(null);
//     localStorage.removeItem("google_access_token");
//   };

//   const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const projectNumber = e.target.value;
//     const project =
//       projectList.find((p) => p.projectNumber === projectNumber) || null;
//     setSelectedProject(project);

//     // Reset diagram state when project changes
//     setDiagramUrl(null);
//     setDiagramError(null);
//   };

//   const generateDiagram = async () => {
//     if (!selectedProject || !token) return;

//     setDiagramLoading(true);
//     setDiagramError(null);
//     setDiagramUrl(null);

//     try {
//       // Fetch project assets from Google Cloud API
//       const response = await fetch(
//         `https://cloudasset.googleapis.com/v1/projects/${selectedProject.projectNumber}/assets?assetTypes=compute.googleapis.com%2FInstance&contentType=RESOURCE`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to fetch project assets: ${response.status}`);
//       }
//       // console.log("Response:", response);
//       const data = await response.json();

//       // axios.post(`${API_BASE_URL}/generateUml`, data).then((response) => {
//       //   console.log(response);
//       // });
//       // Send the data to the backend to generate the diagram
//       const diagramResponse = await fetch(`${API_BASE_URL}/generateUml`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       console.log("DIA RESPONSE:", diagramResponse);

//       if (!diagramResponse.ok) {
//         throw new Error(
//           `Failed to generate diagram: ${diagramResponse.status}`
//         );
//       }
//       diagramResponse.json().then((data) => {
//         setDiagramUrl(data.diagram_url);
//         console.log("DIA DATA:", data);
//         console.log("DIA URL:", data.diagram_url);
//         console.log("DIA image url:", data.diagram_url);
//       });

//       // const diagramData = await diagramResponse;
//       // console.log("Diagram data:", diagramData);
//       // if (diagramData.diagram_url) {
//       //   setDiagramUrl(diagramData.diagram_url);
//       // } else {
//       //   setDiagramError("No diagram URL returned from the server");
//       // }
//     } catch (err) {
//       console.error("Error generating diagram:", err);
//       setDiagramError("Failed to generate diagram. Please try again.");
//     } finally {
//       setDiagramLoading(false);
//     }
//   };

//   const fetchProjects = async (accessToken: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(
//         "https://cloudresourcemanager.googleapis.com/v1/projects",
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`API error: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("Project data:", data);

//       if (data.projects) {
//         const formattedProjects = data.projects.map(
//           // eslint-disable-next-line @typescript-eslint/no-explicit-any
//           (project: any) => ({
//             projectName: project.name,
//             projectNumber: project.projectNumber,
//             projectId: project.projectId,
//           })
//         );
//         setProjectList(formattedProjects);

//         // Set the first project as selected by default if there are projects
//         if (formattedProjects.length > 0) {
//           setSelectedProject(formattedProjects[0]);
//         }
//       } else {
//         setProjectList([]);
//       }
//     } catch (err) {
//       console.error("Error fetching projects:", err);
//       setError("Failed to fetch projects. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="app-container">
//       <h1>GCP Diagrammer</h1>

//       {!token ? (
//         <div className="login-section">
//           <p>Please sign in to access your Google Cloud projects</p>
//           <button onClick={handleLogin} className="login-button">
//             Sign in with Google
//           </button>
//         </div>
//       ) : (
//         <div className="projects-section">
//           <div className="header">
//             <button onClick={logout} className="logout-button">
//               Logout
//             </button>
//           </div>

//           {loading ? (
//             <p>Loading projects...</p>
//           ) : error ? (
//             <div className="error-message">{error}</div>
//           ) : projectList.length > 0 ? (
//             <div className="project-selection">
//               <h2>Your Projects</h2>
//               <div className="combobox-container">
//                 <label htmlFor="project-select">Select a project:</label>
//                 <select
//                   id="project-select"
//                   value={selectedProject?.projectNumber || ""}
//                   onChange={handleProjectChange}
//                   className="project-combobox"
//                 >
//                   {projectList.map((project) => (
//                     <option
//                       key={project.projectNumber}
//                       value={project.projectNumber}
//                     >
//                       {project.projectName}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {selectedProject && (
//                 <div className="project-details">
//                   <h3>Selected Project Details</h3>
//                   <p>
//                     <strong>Name:</strong> {selectedProject.projectName}
//                   </p>
//                   <p>
//                     <strong>Project Number:</strong>{" "}
//                     {selectedProject.projectNumber}
//                   </p>
//                   <button
//                     className="view-resources-button"
//                     onClick={generateDiagram}
//                     disabled={diagramLoading}
//                   >
//                     {diagramLoading
//                       ? "Generating..."
//                       : "View Resources Diagram"}
//                   </button>

//                   {diagramError && (
//                     <div className="error-message">{diagramError}</div>
//                   )}

//                   {diagramUrl && (
//                     <div className="diagram-container">
//                       <h4>Resource Diagram</h4>
//                       <div className="diagram-wrapper">
//                         <img
//                           src={diagramUrl}
//                           alt="Resource Diagram"
//                           className="resource-diagram"
//                         />
//                       </div>
//                       <a
//                         href={diagramUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="open-diagram-button"
//                       >
//                         Open in New Tab
//                       </a>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           ) : (
//             <p>No projects found</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
import { useEffect, useState } from "react";
import "./App.css";
import { ProjectInterface } from "./model/projectInterface";

const GOOGLE_CLIENT_ID =
  "463934685941-85t1csm80b9apqgp91prph9d4k3jbmks.apps.googleusercontent.com";
const REDIRECT_URI = window.location.origin;
const SCOPE = "https://www.googleapis.com/auth/cloud-platform";
const API_BASE_URL = "http://localhost:8000";

function App() {
  const [projectList, setProjectList] = useState<ProjectInterface[]>([]);
  const [selectedProject, setSelectedProject] =
    useState<ProjectInterface | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("google_access_token")
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [diagramUrl, setDiagramUrl] = useState<string | null>(null);
  const [diagramLoading, setDiagramLoading] = useState<boolean>(false);
  const [diagramError, setDiagramError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Check for token in URL hash on page load
  useEffect(() => {
    // Reset diagram state on component mount
    setDiagramLoading(false);
    setDiagramError(null);
    setDiagramUrl(null);

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
  }, [token]);

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
    setProjectList([]);
    setSelectedProject(null);
    setDiagramUrl(null);
    setError(null);
    setDiagramError(null);
    localStorage.removeItem("google_access_token");
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const projectNumber = e.target.value;
    const project =
      projectList.find((p) => p.projectNumber === projectNumber) || null;
    setSelectedProject(project);

    // Reset diagram state when project changes
    setDiagramUrl(null);
    setDiagramError(null);
  };

  const generateDiagram = async () => {
    if (!selectedProject || !token) return;

    setDiagramLoading(true);
    setDiagramError(null);
    setDiagramUrl(null);

    try {
      // Fetch project assets from Google Cloud API
      const response = await fetch(
        `https://cloudasset.googleapis.com/v1/projects/${selectedProject.projectNumber}/assets?assetTypes=compute.googleapis.com%2FInstance&contentType=RESOURCE`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch project assets: ${response.status}`);
      }
      
      const data = await response.json();

      // Send the data to the backend to generate the diagram
      const diagramResponse = await fetch(`${API_BASE_URL}/generateUml`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!diagramResponse.ok) {
        throw new Error(
          `Failed to generate diagram: ${diagramResponse.status}`
        );
      }
      
      const diagramData = await diagramResponse.json();
      
      if (diagramData.diagram_url) {
        setDiagramUrl(diagramData.diagram_url);
      } else {
        setDiagramError("No diagram URL returned from the server");
      }
    } catch (err) {
      console.error("Error generating diagram:", err);
      setDiagramError("Failed to generate diagram. Please try again.");
    } finally {
      setDiagramLoading(false);
    }
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

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>GCP Diagrammer</h1>
        {token && (
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        )}
      </header>

      {!token ? (
        <div className="login-section">
          <h2>Welcome to GCP Diagrammer</h2>
          <p>
            Visualize your Google Cloud Platform infrastructure with interactive diagrams.
            Please sign in to access your projects.
          </p>
          <button onClick={handleLogin} className="login-button">
            Sign in with Google
          </button>
        </div>
      ) : (
        <div className="projects-section">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading your projects...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => fetchProjects(token || "")} className="retry-button">
                Retry
              </button>
            </div>
          ) : projectList.length > 0 ? (
            <div className="content-container">
              <aside className={`project-sidebar ${isDrawerOpen ? 'open' : ''}`}>
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
                </div>
                <button className="drawer-toggle" onClick={toggleDrawer}>
                  {isDrawerOpen ? "←" : "→"}
                </button>
              </aside>

              <main className="main-content">
                {selectedProject && (
                  <div className="project-details">
                    <div className="project-header">
                      <h3>{selectedProject.projectName}</h3>
                      <span className="project-id">ID: {selectedProject.projectId}</span>
                    </div>
                    
                    <div className="action-buttons">
                      <button
                        className="view-resources-button"
                        onClick={generateDiagram}
                        disabled={diagramLoading}
                      >
                        {diagramLoading ? (
                          <>
                            <span className="loading-spinner"></span>
                            Generating diagram...
                          </>
                        ) : (
                          "Generate Resource Diagram"
                        )}
                      </button>
                    </div>

                    {diagramError && (
                      <div className="error-message">{diagramError}</div>
                    )}

                    {diagramUrl && (
                      <div className="diagram-container">
                        <div className="diagram-header">
                          <h4>Resource Diagram</h4>
                          <a
                            href={diagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="open-diagram-button"
                          >
                            Open in New Tab
                          </a>
                        </div>
                        <div className="diagram-wrapper">
                          <img
                            src={diagramUrl}
                            alt="Resource Diagram"
                            className="resource-diagram"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </main>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No projects found</h3>
              <p>We couldn't find any GCP projects associated with your account.</p>
              <button onClick={() => fetchProjects(token || "")} className="retry-button">
                Refresh Projects
              </button>
            </div>
          )}
        </div>
      )}
      
      <footer className="app-footer">
        <p>GCP Diagrammer &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;