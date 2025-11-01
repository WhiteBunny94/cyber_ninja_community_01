// Use an environment variable for the API base URL so it can differ between
// development (local json-server) and production (real API). If REACT_APP_API_BASE_URL
// is not set the code will default to the local json-server used during development.
export const appBaseUrl = 'https://6905997dee3d0d14c1330ece.mockapi.io/api/v1/' || 'http://localhost:3005/';