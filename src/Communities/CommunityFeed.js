import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Community.css';

function CommunityFeed() {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popularKeywords, setPopularKeywords] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);

  const categoryMapping = {
    INFO: '정보',
    GOSSIP: '잡담',
    RECRUIT: '취업',
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/community', {
          timeout: 10000
        });
        if (response.data && response.data.data) {
          setAllPosts(response.data.data || []);
          setPosts(response.data.data || []); // Initialize posts with all data
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
        } else {
          console.error('Unexpected data format for popular keywords');
        }
      } catch (error) {
        console.error('인기 검색어를 가져오는 데 실패했습니다:', error.message);
      }
    };

    // Fetch popular keywords initially
    fetchPopularKeywords();

    // Set interval to fetch popular keywords every 3 minutes
    const intervalId = setInterval(fetchPopularKeywords, 180000); // 3 minutes

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert('검색어를 입력해 주세요.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/community/search', {
        params: { keyword: searchTerm.trim() }
      });
      if (response.data && Array.isArray(response.data.data)) {
        setAllPosts(response.data.data || []);
        setPosts(response.data.data || []); // Initialize posts with search results
        setCurrentPage(1); // Reset to page 1 on search
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
    setCurrentPage(1); // Reset to page 1 when category changes
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Filtered posts based on category and search term
  const filteredPosts = allPosts.filter(post =>
      (selectedCategory === 'ALL' || post.category === selectedCategory) &&
      (post.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate total pages and slice posts for the current page
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

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
            {!loading && !error && paginatedPosts.length === 0 && <p>게시글이 없습니다.</p>}
            {paginatedPosts.map((post, index) => (
                <div className="post" key={index} onClick={() => window.location.href = `/community/post/${encodeURIComponent(post.title)}`}>
                  <h3>{post.title}</h3>
                  <p className="post-info">
                    작성일: {formatDate(post.createdAt)} | 카테고리: {categoryMapping[post.category]}
                  </p>
                </div>
            ))}
          </div>
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>이전</button>
            {[...Array(totalPages)].map((_, index) => (
                <button
                    key={index}
                    className={currentPage === index + 1 ? 'active' : ''}
                    onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>다음</button>
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