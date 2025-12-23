import { useState, useEffect, useRef } from 'react';
import { socketService } from '../services/socketService';
import { Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { TuitionCard } from './TuitionCard';

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Connect to WebSocket
    socketService.connect();
    setIsConnected(true);

    // Listen for messages
    const unsubscribe = socketService.onMessage((data) => {
      setIsTyping(false);

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: data.message,
        timestamp: data.timestamp || new Date().toISOString(),
        data: data.data,
        messageType: data.type,
      };

      setMessages((prev) => [...prev, botMessage]);
    });

    return () => {
      unsubscribe();
      socketService.disconnect();
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim() || !isConnected) return;

    // Add user message to UI
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Send to backend
    socketService.sendMessage(inputMessage);

    // Clear input
    setInputMessage('');
  };

  const quickActions = [
    { label: '🔍 Check Tuition', message: 'I want to check my tuition' },
    { label: '💳 Pay Tuition', message: 'I want to pay my tuition' },
    { label: '📊 Unpaid List', message: 'Show unpaid students for 2024-Fall' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-md p-4 flex items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
            AI
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Tuition Assistant</h1>
            <p className="text-sm text-gray-500">
              {isConnected ? (
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Online
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Offline
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            <h2 className="text-2xl font-bold mb-2">Welcome to Tuition Assistant!</h2>
            <p className="mb-4">I can help you with:</p>
            <ul className="text-left inline-block space-y-1">
              <li>• Check tuition balance</li>
              <li>• Make tuition payments</li>
              <li>• View unpaid tuition (admin)</li>
            </ul>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id}>
            <MessageBubble message={message} />
            {message.type === 'bot' && message.data && message.messageType && (
              <div className="ml-2">
                <TuitionCard
                  data={message.data}
                  type={message.messageType as 'tuition_info' | 'payment_success' | 'unpaid_list'}
                />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length < 3 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2 justify-center">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputMessage(action.message);
                }}
                className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-100 shadow-sm transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!isConnected || !inputMessage.trim()}
            className="bg-primary-600 text-white px-6 py-3 rounded-full hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
