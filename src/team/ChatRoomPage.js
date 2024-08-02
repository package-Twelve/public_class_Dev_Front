import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useParams } from 'react-router-dom';
import './ChatRoomPage.module.css';

const ChatRoomPage = () => {
  const { teamsId } = useParams();
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const stompClient = useRef(null);

  useEffect(() => {
    const connect = () => {
      const socket = new SockJS(`/api/teams/ws`);
      stompClient.current = Stomp.over(socket);
      stompClient.current.connect({}, onConnected, onError);
    };

    const onConnected = () => {
      stompClient.current.subscribe(`/topic/chatroom/${teamsId}`, onMessageReceived);
      stompClient.current.send('/app/chat.addUser',
          {},
          JSON.stringify({ sender: '사용자 이름', type: 'JOIN' })
      );
    };

    const onError = (error) => {
      console.error('Could not connect to WebSocket server. Please refresh this page to try again!', error);
    };

    const onMessageReceived = (message) => {
      const newMessage = JSON.parse(message.body);
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    connect();

    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect();
      }
    };
  }, [teamsId]);

  const handleSendMessage = () => {
    if (chatMessage.trim() === '') return;

    const message = {
      sender: '사용자 이름',
      content: chatMessage,
      type: 'CHAT'
    };

    stompClient.current.send('/app/chat.sendMessage', {}, JSON.stringify(message));
    setChatMessage('');
  };

  return (
      <div className="chat-room-page-container">
        <div className="section">
          <h3>라이브 채팅</h3>
          <ul>
            {chatMessages.map((message, index) => (
                <li key={index}>
                  <span>{message.sender}</span>
                  <span>{message.content}</span>
                  <span>{new Date(message.timestamp).toLocaleDateString()} {new Date(message.timestamp).toLocaleTimeString()}</span>
                </li>
            ))}
          </ul>
          <input
              type="text"
              placeholder="내용을 입력해주세요"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>전송</button>
        </div>
      </div>
  );
};

export default ChatRoomPage;
