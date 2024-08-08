import React, {useCallback, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';
import {useParams} from 'react-router-dom';
import style from './ChatRoomPage.module.css';
import Nav from '../Nav';

const ChatRoomPage = () => {
  const {teamsId} = useParams();
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const stompClient = useRef(null);
  const [userName, setUserName] = useState('');

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await axios.get(
          'http://localhost:8080/api/users/profiles', {
            headers: {
              Authorization: `${localStorage.getItem('accessToken')}`
            }
          });
      const name = response.data.data.name;
      localStorage.setItem('userName', name);
      setUserName(name);
    } catch (err) {
      if (err.response.status === 403 || err.response.status === 401) {
        alert('프로필 정보를 가져오는데 실패했습니다. 다시 로그인 해주세요.', err);
      }
    }
  }, []);

  const fetchChatMessages = useCallback(async () => {
    try {
      const response = await axios.get(
          `http://localhost:8080/api/chatrooms/${teamsId}/messages`, {
            headers: {
              Authorization: `${localStorage.getItem('accessToken')}`
            }
          });
      setChatMessages(response.data);
    } catch (err) {
      if (err.response.status === 403 || err.response.status === 401) {
        alert('채팅 메시지를 가져오는데 실패했습니다. 다시 로그인 해주세요.', err);
      }
    }
  }, [teamsId]);

  const connectWebSocket = useCallback(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        fetchChatMessages();
        stompClient.current.subscribe(`/topic/chatrooms/${teamsId}`, onMessageReceived);
        stompClient.current.publish({
          destination: '/app/chat.addUser',
          body: JSON.stringify({sender: userName, type: 'JOIN', teamsId: teamsId}),
          headers: {
            Authorization: `${localStorage.getItem('accessToken')}`
          }
        });
      },
      onStompError: (error) => {
        console.error('웹소켓 오류:', error);
      },
      onWebSocketClose: (closeEvent) => {
        console.log('WebSocket 연결이 종료되었습니다. 재연결 시도 중...', closeEvent);
        setTimeout(connectWebSocket, 5000);
      },
      debug: (str) => {
        console.log(str);
      },
    });

    stompClient.current.activate();
  }, [teamsId, userName, fetchChatMessages]);

  useEffect(() => {
    fetchUserProfile();
    connectWebSocket();

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [teamsId, userName, fetchUserProfile, connectWebSocket]);

  const onMessageReceived = (message) => {
    const newMessage = JSON.parse(message.body);
    setChatMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleSendMessage = () => {
    if (chatMessage.trim() === '') {
      return;
    }

    const message = {
      sender: userName,
      content: chatMessage,
      type: 'CHAT',
      teamsId: teamsId,
      timestamp: new Date().toISOString()
    };

    stompClient.current.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(message),
      headers: {
        Authorization: `${localStorage.getItem('accessToken')}`
      }
    });

    setChatMessages((prevMessages) => [...prevMessages, message]);
    setChatMessage('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
      <div className={style.chatRoomPageContainer}>
        <Nav />
        <div className={style.section}>
          <h3 className={style.sectionHeader}>채팅</h3>
          <ul className={style.messageList}>
            {chatMessages.map((message, index) => (
                <li key={index} className={style.messageItem}>
                  <span className={style.messageSender}>{message.sender}</span>
                  <span className={style.messageContent}>{message.content}</span>
                  <span className={style.messageTimestamp}>{new Date(message.timestamp).toLocaleDateString()} {new Date(message.timestamp).toLocaleTimeString()}</span>
                </li>
            ))}
          </ul>
          <div className={style.inputContainer}>
            <input
                type="text"
                placeholder="내용을 입력해주세요"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className={style.inputField}
            />
            <button onClick={handleSendMessage} className={style.sendButton}>전송</button>
          </div>
        </div>
      </div>
  );
};

export default ChatRoomPage;
