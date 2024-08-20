const API_HOST = process.env.REACT_APP_API_HOST ? process.env.REACT_APP_API_HOST : "127.0.0.1";
const API_PORT = process.env.REACT_APP_API_PORT ? process.env.REACT_APP_API_PORT : "8000";
const API_SECURE = process.env.REACT_APP_API_NOT_SECURE && process.env.REACT_APP_API_NOT_SECURE === "false";

export const API_BASE_URL = `http${API_SECURE ? "s" : ""}://${API_HOST}:${API_PORT}`