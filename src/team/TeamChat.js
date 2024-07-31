import {useEffect, useState} from "react";
import {addUser, connect} from './chatService';

const TeamChat = ({teamsId, username}) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const onMessageReceived = (msg) => {
      const message = JSON.parse(msg.body);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    const onConnected = () => {
      addUser(stompClient, {sender: username, roomId: teamsId});
    };

    const onError = (error) => {
      console.error('서버에 연결할 수 없습니다. 다시 시도 해주세요', error);
    };

    const stompClient = connect(onMessageReceived, onConnected, onError);
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
      <div>
        <h2>채팅</h2>
        <div>
          {messages.map((message, index) => (
              <div key={index}>
                <b>{message.sender}</b>: {message.content}
              </div>
          ))}
        </div>
        <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="내용을 입력해주세요."
        />
        <button onClick={handleSendMessage}>전송</button>
      </div>
  );
};

export default TeamChat;