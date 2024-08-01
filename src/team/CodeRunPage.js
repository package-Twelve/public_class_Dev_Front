import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CodeRunPage.module.css';

const CodeRunPage = () => {
  const { teamsId } = useParams();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [codeRuns, setCodeRuns] = useState([]);

  const fetchCodeRuns = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/coderuns/myteam/runs`);
      setCodeRuns(response.data.data);
    } catch (error) {
      console.error('Failed to fetch code runs:', error);
    }
  };

  useEffect(() => {
    if (teamsId) {
      fetchCodeRuns();
    }
  }, [teamsId]);

  const handleRunCode = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/api/coderuns/myteam/1/runs`, {
        code,
        language,
      });
      setOutput(response.data.data.result);
      fetchCodeRuns();
    } catch (error) {
      console.error('Failed to run code:', error);
    }
  };

  return (
      <div className="code-run-page-container">
        <div className="section">
          <h3>코드 실행</h3>
          <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="코드를 입력하세요"
          />
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
          <button onClick={handleRunCode}>코드 실행</button>
          <h4>실행 결과:</h4>
          <pre>{output}</pre>
        </div>
        <div className="section">
          <h3>코드 실행 기록</h3>
          <ul>
            {codeRuns.map((run, index) => (
                <li key={index}>
                  <span>{run.language}</span>
                  <span>{run.responseTime} ms</span>
                  <pre>{run.result}</pre>
                </li>
            ))}
          </ul>
        </div>
      </div>
  );
};

export default CodeRunPage;
