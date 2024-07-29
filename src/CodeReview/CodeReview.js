import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from '../Nav';
import './CodeReview.css';

const CodeReview = () => {
  const [codeReviews, setCodeReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCodeReviews(currentPage, searchCategory); // 페이지와 검색 카테고리를 기반으로 데이터를 로드합니다.
  }, [currentPage, searchCategory]); // currentPage와 searchCategory가 변경될 때마다 데이터 로드

  const fetchCodeReviews = async (page, category = '') => {
    let url = 'http://localhost:8080/api/codereviews'; // 기본 URL
    if (category) {
      url += `/search?category=${category}&page=${page}`; // 검색 요청 시 URL
    } else {
      url += `?page=${page}`; // 페이지 이동 요청 시 URL
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
        setSearchCategory(category); // 검색 카테고리 설정
      } else {
        setSearchCategory('');
      }
    } catch (error) {
      console.error('Error fetching code reviews:', error);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
    fetchCodeReviews(1, searchText); // 검색 시 첫 페이지 데이터 로드
  };

  const handlePageClick = (page) => {
    setCurrentPage(page); // 페이지 클릭 시 현재 페이지 상태 업데이트
    fetchCodeReviews(page, searchCategory); // 페이지 클릭 시 해당 페이지 데이터 로드
  };

  const handleWriteReview = () => {
    navigate('/codereviews/write');
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
                  onChange={(e) => setSearchText(e.target.value)} // 입력값을 상태에 저장
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
                      <div key={review.id} className="code-review-item">
                        <div className="item-header">
                          <h3 className="item-title">{review.title}</h3>
                          <p className="item-created-at">{new Date(review.createdAt).toLocaleDateString()}</p>
                          <p className="item-category">{review.category}</p>
                        </div>
                        <p className="item-name">{review.name}</p>
                        <p className="item-contents">{review.contents}</p>
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
