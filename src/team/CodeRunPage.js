import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import style from './CodeRunPage.module.css';
import Nav from '../Nav';

const CodeRunPage = () => {
  const { teamsId } = useParams();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [codeRuns, setCodeRuns] = useState([]);
  const [todayCodeKata, setTodayCodeKata] = useState({ id: null, title: '', contents: '' });

  useEffect(() => {
    fetchCodeRuns();
    fetchTodayCodeKata();
  }, [teamsId]);

  const fetchCodeRuns = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/coderuns/${teamsId}/runs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setCodeRuns(response.data.data);
    } catch (error) {
      console.error('코드 실행 기록을 가져오는 데 실패했습니다:', error);
    }
  };

  const fetchTodayCodeKata = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/codekatas/today`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setTodayCodeKata(response.data.data);
    } catch (error) {
      console.error('오늘의 코드카타를 가져오는 데 실패했습니다:', error);
    }
  };

  const handleRunCode = async () => {
    if (!todayCodeKata.id) {
      console.error('오늘의 코드카타 ID를 가져오지 못했습니다.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8080/api/coderuns/${teamsId}/${todayCodeKata.id}/runs`, {
        code,
        language,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setOutput(response.data.data.result);
      fetchCodeRuns();
    } catch (error) {
      console.error('코드 실행에 실패했습니다:', error);
    }
  };

  return (
      <div>
        <Nav />
        <div className={style["code-run-page-container"]}>
          <div className={style.section}>
            <h3>오늘의 코드카타</h3>
            <h4>{todayCodeKata.title}</h4>
            <p>{todayCodeKata.contents}</p>
          </div>
          <div className={style.section}>
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
          <div className={style.section}>
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
      </div>
  );
};

export default CodeRunPage;
