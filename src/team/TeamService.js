import axios from 'axios';

const API_URL = 'http://localhost:8080/api/teams';
const API_USERS_URL = 'http://localhost:8080/api/users';

const applyMatch = async () => {
  return await axios.post(`${API_URL}/match`);
};

const createTeam = async () => {
  return await axios.post(`${API_URL}/create`);
};

const getTeamsByUsers = async (usersId) => {
  if (!usersId) {
    throw new Error('Users ID is not defined');
  }
  return await axios.get(`${API_URL}/users/${usersId}`);
};

const getUsersProfile = async () => {
  return await axios.get(`${API_USERS_URL}/profiles`);
};

const getTeamsById = async (teamsId) => {
  if (!teamsId) {
    throw new Error('Teams ID is not defined');
  }
  return await axios.get(`${API_URL}/${teamsId}`);
};

export { applyMatch, createTeam, getTeamsByUsers, getUsersProfile, getTeamsById };
