import React, {useEffect, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from './Community.module.css'; // CSS Module import
import reissueToken from "../reissueToken";
import Nav from "../Nav";

function CommunityFeed() {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popularKeywords, setPopularKeywords] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

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
        if (response.data && response.data.data) {
          setAllPosts(response.data.data || []);
          setPosts(response.data.data || []);
        } else {
          setError('Unexpected data format received.');
        }
      } catch (err) {
        if (err.response && err.response.data.statusCode === 401 && err.response.data.message === "토큰이 만료되었습니다.") {
          await reissueToken(err);
        }
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const fetchPopularKeywords = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/community/searchRank');
      if (response.data && Array.isArray(response.data.data)) {
        setPopularKeywords(response.data.data);
      } else {
        console.error('Unexpected data format for popular keywords');
      }
    } catch (err) {
      console.error('인기 검색어를 가져오는 데 실패했습니다:', err.message);
      if (err.response && err.response.data.statusCode === 401 && err.response.data.message === "토큰이 만료되었습니다.") {
        await reissueToken(err);
      }
    }
  };

  useEffect(() => {
    fetchPopularKeywords();

    const intervalId = setInterval(fetchPopularKeywords, 1800000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSearch = async () => {
    const searchTerm = searchInputRef.current.value;
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
        setPosts(response.data.data || []);
        setCurrentPage(1);
      } else {
        setError('Unexpected data format received.');
      }
    } catch (err) {
      console.error('Error fetching search results:', err);
      setError('검색 결과를 가져오는 데 실패했습니다.');
      if (err.response && err.response.data.statusCode === 401 && err.response.data.message === "토큰이 만료되었습니다.") {
        await reissueToken(err);
      }
    } finally {
      setLoading(false);
    }
    fetchPopularKeywords();
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const filteredPosts = allPosts.filter(post =>
      (selectedCategory === 'ALL' || post.category === selectedCategory) &&
      (post.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handlePostClick = (postId) => {
    navigate(`/community/post/${postId}`);
  };

  return (
      <>
        <Nav />
        <div className={style["main-content"]}>
          <div className={style["feed-content"]}>
            <div className={style.header}>
              <h1>Community Feed</h1>
              <button
                  className={style["post-button"]}
                  onClick={() => navigate('/community/write')}
              >
                글쓰기
              </button>
            </div>
            <div className={style["search-container"]}>
              <input
                  type="text"
                  className={style["search-bar"]}
                  placeholder="검색할 내용을 입력해주세요"
                  ref={searchInputRef}
              />
              <button className={style["search-button"]} onClick={handleSearch}>검색</button>
            </div>
            <div className={style["category-filter"]}>
              <label htmlFor="category-select">카테고리 선택:</label>
              <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
              >
                <option value="ALL">전체</option>
                {Object.entries(categoryMapping).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>
            <div className={style["post-list"]}>
              {loading && <p>Loading...</p>}
              {error && <p className={style["error-message"]}>{error}</p>}
              {!loading && !error && paginatedPosts.length === 0 && <p>게시글이 없습니다.</p>}
              {paginatedPosts.map((post) => (
                  <div
                      className={style.post}
                      key={post.id}
                      onClick={() => handlePostClick(post.id)}
                  >
                    <h3>{post.title}</h3>
                    <p className={style["post-info"]}>
                      작성일: {formatDate(post.createdAt)} |
                      카테고리: {categoryMapping[post.category]}
                    </p>
                  </div>
              ))}
            </div>
            <div className={style.pagination}>
              <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
              >
                이전
              </button>
              {[...Array(totalPages)].map((_, index) => (
                  <button
                      key={index}
                      className={currentPage === index + 1 ? style.active : ''}
                      onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
              ))}
              <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
              >
                다음
              </button>
            </div>
          </div>
          <div className={style.sidebar}>
            <div className={style.ranking}>
              <h2>인기 검색어</h2>
              <ul>
                {popularKeywords.map((keyword, index) => (
                    <li key={index} className={style["ranking-item"]}>
                      <span className={style["ranking-index"]}>{index + 1}위</span>
                      <span className={style["ranking-keyword"]}>{keyword.keyword}</span>
                    </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </>
  );
}

export default CommunityFeed;
