import axios from "axios";

const API_URL = 'http://localhost:8080/api/teams';

const applyMatch = async () => {
  return await axios.post(`${API_URL}/match`);
};

const createTeam = async () => {
  return await axios.post(`${API_URL}/create`);
};

const getTeamById = async (teamsId) => {
  return await axios.get(`${API_URL}/${teamsId}`);
};

export { applyMatch, createTeam, getTeamById }