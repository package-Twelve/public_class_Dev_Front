import React, { useEffect, useState } from 'react';
import { connect, sendMessage, addUser } from './ChatService';
import style from './TeamChat.module.css';

const TeamChat = ({ teamsId, username }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const onMessageReceived = (msg) => {
      const message = JSON.parse(msg.body);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    const onConnected = () => {
      addUser(stompClient, { sender: username, roomId: teamsId });
      setIsConnected(true);
    };

    const onError = (error) => {
      console.error('웹 소켓 서버에 접속할 수 없습니다. 다시 시도해주세요.', error);
      setIsConnected(false);
    };

    const stompClient = connect(teamsId, onMessageReceived, onConnected, onError);
    setStompClient(stompClient);

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [teamsId, username]);

  const handleSendMessage = () => {
    if (stompClient && inputMessage.trim()) {
      const chatMessage = {
        sender: username,
        content: inputMessage,
        roomId: teamsId,
      };
      sendMessage(stompClient, chatMessage);
      setInputMessage('');
    }
  };

  return (
      <div className={style.teamChat}>
        <h2 className={style.title}>채팅</h2>
        <div className={style.chatBox}>
          {messages.map((message, index) => (
              <div key={index}>
                <b>{message.sender}</b>: {message.content}
              </div>
          ))}
        </div>
        <div className={style.inputBox}>
          <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="내용을 입력해주세요"
              className={style.input}
          />
          <button onClick={handleSendMessage} className={style.button} disabled={!isConnected}>전송</button>
        </div>
      </div>
  );
};

export default TeamChat;
