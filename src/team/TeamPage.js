import React, { useState } from "react";
import TeamList from './TeamList';
import TeamChat from './TeamChat';
import './TeamPage.css';

const TeamPage = () => {
  const [teamsId, setTeamsId] = useState('');
  const [username, setUsername] = useState('');
  const [isConfigured, setisConfigured] = useState(false);

  const handleStart = () => {
    if (teamsId && username) {
      setisConfigured(true);
    } else {
      alert("모든 값을 입력해주세요");
    }
  };

  return (
      <div className="team-page">
        <hi>팀 매칭 시스템</hi>
        {!isConfigured ? (
            <div className="config-form">
              <input
                  type="text"
                  placeholder="팀 ID를 입력하세요"
                  value={teamsId}
                  onChange={(e) => setTeamsId(e.target.value)}
              />
              <input
                  type="text"
                  placeholder="사용자 이름을 입력하세요"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
              />
              <button onClick={handleStart}>시작</button>
            </div>
        ) : (
            <div>
              <TeamList teamsId={teamsId} />
              <TeamChat teamsId={teamsId} username={username} />
            </div>
        )}
      </div>
  );
};

export default TeamPage;