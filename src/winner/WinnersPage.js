import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './WinnersPage.module.css';
import Nav from '../Nav';

const WinnersPage = () => {
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const response = await axios.get('/api/winners', {
          headers: {
            Authorization: `${localStorage.getItem('accessToken')}`
          }
        });
        setWinners(response.data.data);
      } catch (error) {
        console.error('우승자 목록 조회 실패:', error);
      }
    };

    fetchWinners();
  }, []);

  return (
      <div>
        <Nav />
        <div className={styles.container}>
          <h2>명예의 전당</h2>
          <ul>
            {winners.map(winner => (
                <li key={winner.id}>
                  <Link to={`/winners/${winner.id}`}>
                    {winner.teamName} - {winner.result} (코드카타: {winner.codeKataTitle})
                  </Link>
                </li>
            ))}
          </ul>
        </div>
      </div>
  );
};

export default WinnersPage;
