// components/CommunityFeed.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Community.css';

function CommunityFeed() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 초기 게시글 fetching
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/community', { timeout: 10000 });
        console.log('API Response:', response.data);

        // Extract posts from response.data.data
        if (response.data && Array.isArray(response.data.data)) {
          setPosts(response.data.data);
        } else {
          console.error('Unexpected data format:', response.data);
          setError('Unexpected data format received.');
        }
      } catch (error) {
        setError('게시글을 가져오는 데 실패했습니다.');
        console.error('게시글을 가져오는 데 실패했습니다:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);


  // 검색 처리 함수
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert('검색어를 입력해 주세요.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/community/search`, {
        params: { keyword: searchTerm }
      });
      setPosts(response.data);
    } catch (error) {
      setError('검색 결과를 가져오는 데 실패했습니다.');
      console.error('검색 결과를 가져오는 데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="main-content">
        <div className="header">
          <h1>Community Feed</h1>
          <button className="post-button" onClick={() => window.location.href = '/community/write'}>
            글쓰기
          </button>
        </div>
        <div className="search-container">
          <input
              type="text"
              className="search-bar"
              placeholder="검색할 내용을 입력해주세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>검색</button>
        </div>
        <div className="post-list">
          {loading && <p>Loading...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && posts.length === 0 && <p>게시글이 없습니다.</p>}
          {Array.isArray(posts) && posts.map((post, index) => (
              <div className="post" key={index} onClick={() => window.location.href = `/community/post/${encodeURIComponent(post.title)}`}>
                <h3>{post.title}</h3>
                <p className="post-info">작성자: {post.name} | 작성일: {post.date}</p>
              </div>
          ))}
        </div>
        <div className="pagination">
          <button>이전</button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>4</button>
          <button>5</button>
          <button>다음</button>
        </div>
      </div>
  );
}

export default CommunityFeed;
