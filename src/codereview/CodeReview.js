import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from '../Nav';
import './CodeReview.css';
import reissueToken from '../reissueToken';

const CodeReview = () => {
  const [codeReviews, setCodeReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCodeReviews(currentPage, searchCategory);
  }, [currentPage, searchCategory]);

  const fetchCodeReviews = async (page, category = '') => {
    let url = 'http://localhost:8080/api/codereviews';
    if (category) {
      url += `/search?category=${category}&page=${page}`;
    } else {
      url += `?page=${page}`;
    }

    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `${accessToken}`
        }
      });
      const data = response.data.data;
      setCodeReviews(data.items || []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
      setTotalItems(data.totalItems || 0);
      if (category) {
        setSearchCategory(category);
      } else {
        setSearchCategory('');
      }
    } catch (error) {
      if(error.response.data.statusCode === 401 && error.response.data.message === "토큰이 만료되었습니다.") {
        reissueToken(error);
      }
      console.error('Error fetching code reviews:', error);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCodeReviews(1, searchText);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
    fetchCodeReviews(page, searchCategory);
  };

  const handleWriteReview = () => {
    navigate('/codereviews/write');
  };

  const handleItemClick = (id) => {
    navigate(`/codereviews/${id}`);
  };

  return (
      <>
        <Nav />
        <div className="code-review-container">
          <div className="white-box">
            <div className="header">
              <h2>
                Code Review <span className="total-items">(총 {totalItems})</span>
              </h2>
              <button className="write-review-btn" onClick={handleWriteReview}>
                코드 리뷰 등록
              </button>
            </div>
            <div className="search-bar">
              <input
                  type="text"
                  placeholder="검색할 카테고리를 태그를 입력해주세요"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
              />
              <button className="search-btn" onClick={handleSearch}>
                검색
              </button>
            </div>
            {searchCategory && (
                <div className="search-category">
                  검색 카테고리: <strong>{searchCategory}</strong>
                </div>
            )}
            <div className="code-reviews">
              {codeReviews.length > 0 ? (
                  codeReviews.map((review) => (
                      <div
                          key={review.id}
                          className="code-review-item"
                          onClick={() => handleItemClick(review.id)}
                          style={{ cursor: 'pointer' }}
                      >
                        <div className="item-header">
                          <h3 className="item-title">{review.title}</h3>
                          <p className="item-created-at">{new Date(review.createdAt).toLocaleDateString()}</p>
                          <p className="item-category">{review.category}</p>
                        </div>
                        <p className="item-name">{review.name}</p>
                      </div>
                  ))
              ) : (
                  <p>No code reviews found.</p>
              )}
            </div>
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                  <span
                      key={index}
                      className={`page-number ${currentPage === index + 1 ? 'current' : ''}`}
                      onClick={() => handlePageClick(index + 1)}
                  >
              {index + 1}
            </span>
              ))}
            </div>
          </div>
        </div>
      </>
  );
};

export default CodeReview;
