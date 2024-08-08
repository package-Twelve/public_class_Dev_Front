import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useParams } from 'react-router-dom';
import style from './ChatRoomPage.module.css';
import Nav from '../Nav';

const ChatRoomPage = () => {
  const { teamsId } = useParams();
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const stompClient = useRef(null);
  const [userName, setUserName] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await axios.get(
          '/api/users/profiles', {
            headers: {
              Authorization: `${localStorage.getItem('accessToken')}`
            }
          });
      const name = response.data.data.name;
      localStorage.setItem('userName', name);
      setUserName(name);
    } catch (err) {
      alert('프로필 정보를 가져오는데 실패했습니다.', err);
    }
  }, []);

  const fetchChatMessages = useCallback(async () => {
    try {
      const response = await axios.get(
          `/api/chatrooms/${teamsId}/messages`, {
            headers: {
              Authorization: `${localStorage.getItem('accessToken')}`
            }
          });
      setChatMessages(response.data);
    } catch (err) {
      alert('채팅 메시지를 가져오는데 실패했습니다.', err);
    }
  }, [teamsId]);

  const connectWebSocket = useCallback(() => {
    const socket = new SockJS('/ws');
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        fetchChatMessages();
        stompClient.current.subscribe(`/topic/chatrooms/${teamsId}`, onMessageReceived);
        stompClient.current.publish({
          destination: '/app/chat.addUser',
          body: JSON.stringify({ sender: userName, type: 'JOIN', teamsId: teamsId }),
          headers: {
            Authorization: `${localStorage.getItem('accessToken')}`,
          },
        });
      },
      onStompError: (error) => {
        alert('웹소켓 오류:', error);
      },
      onWebSocketClose: (closeEvent) => {
        setTimeout(connectWebSocket, 5000);
      },
      debug: (str) => {
      },
    });

    stompClient.current.activate();
  }, [teamsId, userName, fetchChatMessages]);



  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    if (userName) {
      connectWebSocket();
    }
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [teamsId, userName, connectWebSocket]);

  const onMessageReceived = (message) => {
    const newMessage = JSON.parse(message.body);
    setChatMessages((prevMessages) => {
      if (!prevMessages.some(msg => msg.id === newMessage.id)) {
        return [...prevMessages, newMessage];
      }
      return prevMessages;
    });
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

    if (stompClient.current) {
      stompClient.current.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(message),
        headers: {
          Authorization: `${localStorage.getItem('accessToken')}`
        }
      });
    }

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
