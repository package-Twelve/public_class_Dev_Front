import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from '../Nav';
import style from './ManageTeamsPage.module.css';

const ManageTeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/users/profiles', {
          headers: {
            Authorization: `${localStorage.getItem('accessToken')}`
          }
        });
        const profile = response.data.data;
        console.log(profile);
        if (profile && profile.role === 'ADMIN') {
          setIsAdmin(true);
        }
      } catch (error) {
        setError('admin 권한 확인에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('토큰이 없습니다.');
        }

        const response = await axios.get('http://localhost:8080/api/manage/teams/all', {
          headers: {
            Authorization: `${localStorage.getItem('accessToken')}`
          }
        });
        setTeams(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchTeams();
  }, []);

  const handleDeleteAll = async () => {
    if (window.confirm('모든 팀을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        await axios.delete('http://localhost:8080/api/manage/teams/delete-all', {
          headers: {
            Authorization: `${localStorage.getItem('accessToken')}`
          }
        });
        alert('모든 팀이 삭제되었습니다.');
        setTeams([]);
      } catch (error) {
        alert(error.response ? error.response.data.message : error.message);
      }
    }
  };

  const handleDeleteTeam = async (teamsId) => {
    if (window.confirm(`팀 ID ${teamsId}를 삭제하시겠습니까?`)) {
      try {
        await axios.delete(`http://localhost:8080/api/manage/teams/${teamsId}`, {
          headers: {
            Authorization: `${localStorage.getItem('accessToken')}`
          }
        });
        alert('팀이 삭제되었습니다.');
        setTeams(teams.filter(team => team.id !== teamsId));
      } catch (error) {
        alert(error.response ? error.response.data.message : error.message);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      const today = new Date();
      return `${today.toLocaleDateString()} ${today.toLocaleTimeString()}`;
    }
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
      <>
        <Nav />
        <div className={style["manage-teams-page-container"]}>
          <div className={style["white-box"]}>
            <h2>관리자 팀 관리</h2>
            {!isAdmin ? (
                <p>접근 권한이 없습니다.</p>
            ) : loading ? (
                <p>팀 정보를 불러오는 중...</p>
            ) : error ? (
                <p>오류 발생: {error}</p>
            ) : (
                <>
                  <div className={style["teams-list"]}>
                    {teams.map((team) => (
                        <div key={team.id} className={style["teams-item"]}>
                          <h3>{team.name}</h3>
                          <ul>
                            {team.teamMembers.map((member, index) => (
                                <li key={index}>
                                  <span>{member}</span>
                                </li>
                            ))}
                          </ul>
                          <span className={style["date-info"]}>생성일: {formatDate(
                              team.createdAt)}</span>
                          <button onClick={() => handleDeleteTeam(team.id)}>팀 삭제</button>
                        </div>
                    ))}
                  </div>
                  <button className={style["delete-all-button"]} onClick={handleDeleteAll}>모든 팀 삭제</button>
                </>
            )}
          </div>
        </div>
      </>
  );
};

export default ManageTeamsPage;
