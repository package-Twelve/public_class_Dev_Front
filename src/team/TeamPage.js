import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TeamList from './TeamList';
import TeamChat from './TeamChat';
import { createTeam, getTeamsByUsers, applyMatch, getTeamsById, getUsersProfile } from './TeamService';
import style from './TeamPage.module.css';
import Nav from '../Nav';

const TeamPage = () => {
  const { teamsId } = useParams();
  const [teamsIdState, setTeamsIdState] = useState(teamsId || null);
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUsersProfile();
        const profile = response.data.data;
        setUsername(profile.name);
        const users = {
          id: profile.id,
          username: profile.name,
        };
        setUsers(users);
        if (teamsIdState) {
          fetchTeamsById(teamsIdState);
        } else {
          fetchTeams(users.id);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [teamsIdState]);

  const fetchTeams = async (usersId) => {
    console.log('Fetching team for user:', usersId);
    if (!usersId) {
      console.error('Users ID is not defined');
      return;
    }

    try {
      const response = await getTeamsByUsers(usersId);
      if (response.data.data) {
        setTeamsIdState(response.data.data.id);
        setTeamName(response.data.data.name);
        setIsConfigured(true);
      }
    } catch (error) {
      console.error('Failed to fetch team:', error);
    }
  };

  const fetchTeamsById = async (teamsId) => {
    console.log('Fetching team by ID:', teamsId);
    if (!teamsId) {
      console.error('Teams ID is not defined');
      return;
    }

    try {
      const response = await getTeamsById(teamsId);
      if (response.data.data) {
        setTeamsIdState(response.data.data.id);
        setTeamName(response.data.data.name);
        setIsConfigured(true);
      }
    } catch (error) {
      console.error('Failed to fetch team by ID:', error);
    }
  };

  const handleCreateTeam = async () => {
    try {
      const response = await createTeam();
      setTeamsIdState(response.data.data.id);
      setTeamName(response.data.data.name);
      setIsConfigured(true);
    } catch (error) {
      console.error('Failed to create team:', error);
    }
  };

  const handleApplyMatch = async () => {
    try {
      const response = await applyMatch();
      console.log('Match applied:', response.data);
      fetchTeams(users.id);
    } catch (error) {
      console.error('Failed to apply match:', error);
    }
  };

  const navigateToTeamPage = () => {
    if (teamsIdState) {
      window.location.href = `/teams/${teamsIdState}`;
    } else {
      alert('팀이 생성되지 않았습니다.');
    }
  };

  return (
      <div>
        <Nav />
        <div className={style.teamPage}>
          <h1 className={style.title}>팀 매칭 시스템</h1>
          <div className={style.configForm}>
            <p>{username} 님 환영합니다!</p>
            {teamName && <p>현재 팀 이름: {teamName}</p>}
            <button onClick={handleCreateTeam}>팀 생성</button>
            <button onClick={handleApplyMatch}>매칭 시작</button>
            <button onClick={navigateToTeamPage}>나의 팀 페이지</button>
          </div>
          {isConfigured && (
              <div>
                <p>현재 팀 이름: {teamName}</p>
                <div className={style.teamInfo}>
                  <TeamList users={users} />
                </div>
                <div className={style.teamChat}>
                  <TeamChat teamsId={teamsIdState} username={username} />
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default TeamPage;
