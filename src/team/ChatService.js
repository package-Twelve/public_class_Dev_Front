import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const connect = (onMessageReceived, onConnected, onError) => {
  const socket = new SockJS('http://localhost:8080/ws');
  const stompClient = Stomp.over(socket);

  stompClient.connect({}, onConnected, onError);
  stompClient.onMessage = onMessageReceived;

  return stompClient;
};

const sendMessage = (stompClient, chatMessage) => {
  stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage));
};

const addUser = (stompClient, chatMessage) => {
  stompClient.send('/app/chat.addUSer', {}, JSON.stringify(chatMessage));
};

export { connect, sendMessage, addUser }