import React, { useEffect, useState } from 'react';
import { getTeamsByUsers } from './TeamService';
import style from './TeamList.module.css';

const TeamList = ({ users }) => {
  const [teams, setTeams] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await getTeamsByUsers(users.id);
        setTeams(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTeam();
  }, [users]);

  if (!teams) {
    return <p>로딩 중...</p>;
  }

  if (!teams.members || teams.members.length === 0) {
    return <p>팀 구성원이 없습니다.</p>;
  }

  return (
      <div className={style.teamInfo}>
        <h2 className={style.title}>팀 이름: {teams.name}</h2>
        <ul className={style.list}>
          {teams.members.map((member, index) => (
              <li key={index} className={index === teams.members.length - 1 ? style.lastItem : style.listItem}>
                {member.username}
              </li>
          ))}
        </ul>
      </div>
  );
};

export default TeamList;
