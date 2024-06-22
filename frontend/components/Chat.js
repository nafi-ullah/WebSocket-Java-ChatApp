"use client";

import { useState, useEffect, useRef } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

export default function Chat() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.activeUsers) {
          setActiveUsers(data.activeUsers.split(", "));
        }
        if (data.userMessage) {
          setMessages((prevMessages) => [...prevMessages, `${data.username}: ${data.userMessage}`]);
        }
        if (data.serverMessage) {
          setMessages((prevMessages) => [...prevMessages, `Server: ${data.serverMessage}`]);
        }
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      };

      socket.onclose = () => {
        setMessages((prevMessages) => [...prevMessages, 'System: Disconnected from the server']);
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
      socket.send(message);
      setMessage('');
    }
  };

  const addEmoji = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji.native);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white w-screen">
      <div className="w-1/2 h-16 border p-4 mb-4">
        <p>Active users: {activeUsers.join(", ")}</p>
      </div>
      <div id="chat-box" className="w-1/2 h-96 border p-4 overflow-y-scroll mb-4" ref={chatBoxRef}>
        {messages.map((msg, index) => {
          const isCurrentUser = msg.startsWith(username);
          return (
            <div
              key={index}
              className={`flex items-start mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isCurrentUser && (
                <img
                  src="https://via.placeholder.com/40"
                  alt="Profile"
                  className="w-10 h-10 rounded-full mr-2"
                />
              )}
              <div className={`p-2 rounded ${isCurrentUser ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}>
                <p>{msg}</p>
              </div>
              {isCurrentUser && (
                <img
                  src="https://via.placeholder.com/40"
                  alt="Profile"
                  className="w-10 h-10 rounded-full ml-2"
                />
              )}
            </div>
          );
        })}
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
      <div id="message-input" className="w-1/2 flex relative">
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
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="absolute right-48 top-1/2 transform -translate-y-1/2"
        >
          😊
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-12 right-0">
            <Picker data={data} onEmojiSelect={addEmoji} />
          </div>
        )}
      </div>
    </div>
  );
}
