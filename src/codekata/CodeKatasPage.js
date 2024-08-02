import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from '../Nav';
import { useNavigate } from 'react-router-dom';
import style from './CodeKatasPage.module.css';

const CodeKatasPage = () => {
  const [codeKatas, setCodeKatas] = useState([]);
  const [todayCodeKata, setTodayCodeKata] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newCodeKataContent, setNewCodeKataContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/users/profiles', {
          headers: {
            Authorization: `${localStorage.getItem('accessToken')}`
          }
        });
        console.log(response);
        const profile = response.data.data;
        console.log(profile.role);
        if (profile && profile.role.includes('ADMIN')) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('사용자 프로필을 불러오는데 실패했습니다:', error);
      }
    };

    const fetchTodayCodeKata = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/codekatas/today');
        setTodayCodeKata(response.data.data);
      } catch (error) {
        console.error('오늘의 코드카타를 불러오는데 실패했습니다:', error);
      }
    };

    const fetchAllCodeKatas = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/codekatas/all', {
          headers: {
            Authorization: `${localStorage.getItem('accessToken')}`
          }
        });
        setCodeKatas(response.data.data);
      } catch (error) {
        console.error('전체 코드카타를 불러오는데 실패했습니다:', error);
      }
    };

    fetchProfile();
    fetchTodayCodeKata();
    fetchAllCodeKatas();
  }, []);

  const handleCreateCodeKata = async () => {
    if (!isAdmin) {
      alert('관리자만 코드카타를 생성할 수 있습니다.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/codekatas/createcodekata', {
        contents: newCodeKataContent
      }, {
        headers: {
          Authorization: `${localStorage.getItem('accessToken')}`
        }
      });
      alert('코드카타가 성공적으로 생성되었습니다.');
      setNewCodeKataContent('');
      setCodeKatas([...codeKatas, response.data.data]);
    } catch (error) {
      console.error('코드카타 생성에 실패했습니다:', error);
      alert('코드카타 생성에 실패했습니다.');
    }
  };

  const handleEditCodeKata = async (id, currentContent) => {
    if (!isAdmin) {
      alert('관리자만 코드카타를 수정할 수 있습니다.');
      return;
    }

    const newContent = prompt('코드카타를 수정하세요:', currentContent);
    if (newContent !== null && newContent.trim() !== '') {
      try {
        await axios.put(`http://localhost:8080/api/codekatas/${id}`, {
          contents: newContent
        }, {
          headers: {
            Authorization: `${localStorage.getItem('accessToken')}`
          }
        });
        alert('코드카타가 성공적으로 수정되었습니다.');
        setCodeKatas(codeKatas.map(kata => kata.id === id ? { ...kata, contents: newContent } : kata));
      } catch (error) {
        console.error('코드카타 수정에 실패했습니다:', error);
        alert('코드카타 수정에 실패했습니다.');
      }
    }
  };

  const handleDeleteCodeKata = async (id) => {
    if (!isAdmin) {
      alert('관리자만 코드카타를 삭제할 수 있습니다.');
      return;
    }

    if (window.confirm('코드카타를 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:8080/api/codekatas/${id}`, {
          headers: {
            Authorization: `${localStorage.getItem('accessToken')}`
          }
        });
        alert('코드카타가 성공적으로 삭제되었습니다.');
        setCodeKatas(codeKatas.filter(kata => kata.id !== id));
      } catch (error) {
        console.error('코드카타 삭제에 실패했습니다:', error);
        alert('코드카타 삭제에 실패했습니다.');
      }
    }
  };

  const handleFetchAllCodeKatas = async () => {
    if (!isAdmin) {
      alert('관리자만 코드카타를 조회할 수 있습니다.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:8080/api/codekatas/all', {
        headers: {
          Authorization: `${localStorage.getItem('accessToken')}`
        }
      });
      setCodeKatas(response.data.data);
      alert('코드카타를 성공적으로 조회했습니다.');
    } catch (error) {
      console.error('전체 코드카타를 불러오는데 실패했습니다:', error);
      alert('전체 코드카타를 불러오는데 실패했습니다.');
    }
  };

  const handleTeamMatch = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/teams/create');
      console.log('Team created:', response.data);
      navigate('/myteam');
    } catch (error) {
      console.error('Error creating team:', error);
      alert('팀 생성에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
      <>
        <Nav />
        <div className={style.container}>
          <div className={style.leftSection}>
            <div className={style.section}>
              <h2>오늘 과제</h2>
              <div className={style.taskBox}>
                <h3>{todayCodeKata?.name || '오늘의 코드카타'}</h3>
                <p>{todayCodeKata?.description || '오늘의 코드카타 설명'}</p>
                <button onClick={handleTeamMatch}>코드카타 참여하기</button>
              </div>
            </div>
          </div>
        </div>
        <div className={style.navButtons}>
          <button onClick={handleFetchAllCodeKatas}>조회</button>
          <button onClick={handleCreateCodeKata}>생성</button>
          <button onClick={() => handleEditCodeKata()}>수정</button>
          <button onClick={() => handleDeleteCodeKata()}>삭제</button>
        </div>
      </>
  );
};

export default CodeKatasPage;
