"use client";

import { useState, useEffect, useRef } from 'react';

export default function Chat() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        setMessages((prevMessages) => [...prevMessages, event.data]);
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      };

      socket.onclose = () => {
        setMessages((prevMessages) => [...prevMessages, 'Disconnected from the server']);
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }
  }, [socket]);

  const handleJoinChat = () => {
    if (username) {
      const newSocket = new WebSocket('ws://localhost:1234');
      newSocket.onopen = () => {
        newSocket.send(username);
        setSocket(newSocket);
      };
    } else {
      alert('Please enter a username.');
    }
  };

  const handleSendMessage = () => {
    if (message && socket && socket.readyState === WebSocket.OPEN) {
      socket.send(`${username}: ${message}`);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white w-screen">
      <div id="chat-box" className="w-1/2 h-96 border p-4 overflow-y-scroll mb-4" ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <div id="username-input" className="w-1/2 flex mb-4">
        <input
          type="text"
          id="username"
          className="w-4/5 p-2 border border-r-0"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          onClick={handleJoinChat}
          className="w-1/5 p-2 border bg-green-500 text-white hover:bg-green-700"
        >
          Join Chat
        </button>
      </div>
      <div id="message-input" className="w-1/2 flex">
        <input
          type="text"
          id="message"
          className="w-4/5 p-2 border border-r-0"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={handleSendMessage}
          className="w-1/5 p-2 border bg-blue-500 text-white hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}