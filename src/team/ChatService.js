import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const connect = (teamsId, onMessageReceived, onConnected, onError) => {
  const socket = new SockJS(`http://localhost:8080/api/teams/${teamsId}/ws`);
  const stompClient = Stomp.over(() => socket);

  stompClient.connect({}, onConnected, (error) => {
    console.error('WebSocket connection error:', error);
    onError(error);
  });

  stompClient.onMessage = onMessageReceived;

  return stompClient;
};

const sendMessage = (stompClient, chatMessage) => {
  if (stompClient && stompClient.connected) {
    stompClient.send('/app/chat.sentMessage', {}, JSON.stringify(chatMessage));
  } else {
    console.error('There is no underlying STOMP connection');
  }
};

const addUser = (stompClient, chatMessage) => {
  if (stompClient && stompClient.connected) {
    stompClient.send('/app/chat.addUser', {}, JSON.stringify(chatMessage));
  } else {
    console.error('There is no underlying STOMP connection');
  }
};

export { connect, sendMessage, addUser };
