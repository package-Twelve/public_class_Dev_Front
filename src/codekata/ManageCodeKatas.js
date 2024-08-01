import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Nav from '../Nav';
import style from './ManageCodeKatas.module.css';

const ManageCodeKatas = () => {
  const [codeKatas, setCodeKatas] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCodeKatas = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/codekatas', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        setCodeKatas(response.data.data);
      } catch (error) {
        console.error('Failed to fetch code katas:', error);
        setError('코드카타를 불러오는 데 실패했습니다.');
      }
    };

    fetchCodeKatas();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/codekatas/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setCodeKatas(codeKatas.filter(kata => kata.id !== id));
    } catch (error) {
      console.error('Failed to delete code kata:', error);
      setError('코드카타를 삭제하는 데 실패했습니다.');
    }
  };

  return (
      <>
        <Nav />
        <div className={style["manage-code-katas-container"]}>
          <div className={style["white-box"]}>
            {error ? (
                <p className={style["error"]}>{error}</p>
            ) : (
                <>
                  <h2>코드카타 관리</h2>
                  <ul>
                    {codeKatas.map(kata => (
                        <li key={kata.id}>
                          <Link to={`/codekatas/${kata.id}/edit`}>{kata.contents}</Link>
                          <button onClick={() => handleDelete(kata.id)}>삭제</button>
                        </li>
                    ))}
                  </ul>
                </>
            )}
          </div>
        </div>
      </>
  );
};

export default ManageCodeKatas;
