import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Community.css';

function CommunityFeed() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popularKeywords, setPopularKeywords] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categoryMapping = {
    INFO: '정보',
    GOSSIP: '잡담',
    RECRUIT: '취업',
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/community', { timeout: 10000 });
        if (response.data && Array.isArray(response.data.data)) {
          setPosts(response.data.data);
        } else {
          setError('Unexpected data format received.');
        }
      } catch (error) {
        setError('게시글을 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchPopularKeywords = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/community/searchRank');
        if (response.data && Array.isArray(response.data.data)) {
          setPopularKeywords(response.data.data);
        }
      } catch (error) {
        console.error('인기 검색어를 가져오는 데 실패했습니다:', error.message);
      }
    };

    fetchPopularKeywords();
    const intervalId = setInterval(fetchPopularKeywords, 1800000); // 1800000 ms = 30 minutes

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert('검색어를 입력해 주세요.');
      return;
    }

    try {
      setLoading(true);
      // Convert search term to lowercase
      const lowercaseSearchTerm = searchTerm.trim().toLowerCase();
      const response = await axios.get('http://localhost:8080/api/community/search', {
        params: { keyword: lowercaseSearchTerm }
      });
      if (response.data && Array.isArray(response.data.data)) {
        setPosts(response.data.data);
      } else {
        setError('Unexpected data format received.');
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('검색 결과를 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // 필터링된 게시글 목록
  const filteredPosts = posts.filter(post =>
      (selectedCategory === 'ALL' || post.category === selectedCategory) &&
      (searchTerm.trim() === '' || post.title.toLowerCase().includes(searchTerm.trim().toLowerCase()))
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
      <div className="main-content">
        <div className="feed-content">
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
          <div className="category-filter">
            <label htmlFor="category-select">카테고리 선택:</label>
            <select id="category-select" value={selectedCategory} onChange={handleCategoryChange}>
              <option value="ALL">전체</option>
              {Object.entries(categoryMapping).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
          <div className="post-list">
            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}
            {!loading && !error && filteredPosts.length === 0 && <p>게시글이 없습니다.</p>}
            {filteredPosts.map((post, index) => (
                <div className="post" key={index} onClick={() => window.location.href = `/community/post/${encodeURIComponent(post.title)}`}>
                  <h3>{post.title}</h3>
                  <p className="post-info">
                    작성일: {formatDate(post.createdAt)} | 카테고리: {categoryMapping[post.category]}
                  </p>
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
        <div className="sidebar">
          <div className="ranking">
            <h2>인기 검색어</h2>
            <ul>
              {popularKeywords.map((keyword, index) => (
                  <h3 key={index} className="ranking-item">
                    <span className="ranking-index">{index + 1}</span>
                    <span className="ranking-keyword">{keyword.keyword}</span>
                  </h3>
              ))}
            </ul>
          </div>
        </div>
      </div>
  );
}

export default CommunityFeed;
