import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import './FirstPage.css'; // CSS 파일을 임포트합니다.

const texts = [
  '커뮤니티',
  '코드 리뷰',
  '코드 챌린지',
    '코드 카타'
  // 필요에 따라 텍스트를 추가하세요
];

function FirstPage() {
  const [currentText, setCurrentText] = useState(texts[0]);
  const [fadeClass, setFadeClass] = useState('fade-in');

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeClass('fade-out'); // 현재 텍스트를 페이드 아웃
      setTimeout(() => {
        setCurrentText(prevText => {
          const currentIndex = texts.indexOf(prevText);
          const nextIndex = (currentIndex + 1) % texts.length;
          return texts[nextIndex];
        });
        setFadeClass('fade-in'); // 새 텍스트를 페이드 인
      }, 1200); // 애니메이션이 끝난 후 텍스트 변경
    }, 3000); // 3초마다 텍스트 변경

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  return (
      <>
        <Nav />
        <div className="text-container">
          <div className="static-text">
            public class Dev {'{ '}
            <span className={`dynamic-text ${fadeClass}`}>{currentText}</span>
            {' }'}
          </div>
        </div>
        <div className="additional-info">
          <p>모든 개발자들이 성장하는 공용 공간, <b>퍼블릭 클래스 데브</b></p>
        </div>
      </>
  );
}

export default FirstPage;
