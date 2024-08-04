import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import style from './CodeRunPage.module.css';
import Nav from '../Nav';

const CodeRunPage = () => {
  const {teamsId} = useParams();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [codeRuns, setCodeRuns] = useState([]);
  const [todayCodeKata, setTodayCodeKata] = useState({
    id: null,
    title: '',
    contents: '',
  });

  const exampleCode = {
    javascript: `// Hello World 출력
console.log('Hello, World!');`,
    python: `# Hello World 출력
print('Hello, World!')`,
    java: `// Hello World 출력
public class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`
  };

  useEffect(() => {
    if (teamsId) {
      fetchCodeRuns();
      fetchTodayCodeKata();
    }
  }, [teamsId]);

  const fetchCodeRuns = async () => {
    try {
      const response = await axios.get(
          `/api/coderuns/myteam/${teamsId}/runs`,
          {
            headers: {
              Authorization: `${localStorage.getItem('accessToken')}`,
            },
          }
      );
      console.log('CodeRuns response:', response.data);
      setCodeRuns(response.data || []);
    } catch (error) {
      console.error('코드 실행 기록을 가져오는 데 실패했습니다:', error);
    }
  };

  const fetchTodayCodeKata = async () => {
    try {
      const response = await axios.get(
          `/api/codekatas/today`,
          {
            headers: {
              Authorization: `${localStorage.getItem('accessToken')}`,
            },
          }
      );
      console.log('TodayCodeKata response:', response.data);
      setTodayCodeKata(
          response.data.data || {id: null, title: '', contents: ''});
    } catch (error) {
      console.error('오늘의 코드카타를 가져오는 데 실패했습니다:', error);
    }
  };

  const handleRunCode = async () => {
    if (!todayCodeKata.id) {
      console.error('오늘의 코드카타 ID를 가져오지 못했습니다.');
      return;
    }
    console.log('오늘의 코드카타 ID:', todayCodeKata.id);  // 추가된 로그

    try {
      const response = await axios.post(
          `/api/coderuns/myteam/${teamsId}/${todayCodeKata.id}/runs`,
          {
            code,
            language,
          },
          {
            headers: {
              Authorization: `${localStorage.getItem('accessToken')}`,
            },
          }
      );
      console.log('RunCode response:', response.data);
      setOutput(response.data.result);
      fetchCodeRuns();
    } catch (error) {
      console.error('코드 실행에 실패했습니다:', error);
    }
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    setCode(exampleCode[selectedLanguage]);
  };

  return (
      <div>
        <Nav/>
        <div className={style["code-run-page-container"]}>
          <div className={style.section}>
            <h1>오늘의 코드카타</h1>
            <h4>{todayCodeKata.title}</h4>
            <p>{todayCodeKata.contents}</p>
          </div>
          <div className={style.section2}>
            <h3>코드 실행</h3>
            <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="코드를 입력하세요"
            />
            <select value={language} onChange={handleLanguageChange}>
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
              {codeRuns.length > 0 ? (
                  codeRuns.map((run, index) => (
                      <li key={index}>
                        <span>{run.language}</span>
                        <span>{run.responseTime} ms</span>
                        <pre>{run.result}</pre>
                      </li>
                  ))
              ) : (
                  <li>코드 실행 기록이 없습니다.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
  );
};

export default CodeRunPage;
