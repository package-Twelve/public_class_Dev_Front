import React, { useEffect, useState } from "react";
import { getTeamById } from './teamService';

const TeamList = ({ teamsId }) => {
  const [teams, setTeams] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await getTeamById(teamsId);
        setTeams(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTeam();
  }, [teamsId]);

  return (
    <div>
      {teams ? (
          <div>
            <h2>팀 이름 : {teams.name}</h2>
            <ul>
              {teams.members.map((member, index) =>(
                  <li key={index}>{member.username}</li>
              ))}
            </ul>
          </div>
      ) : (
          <p>로딩 중</p>
      )}
    </div>
  );
};

export default TeamList;
