import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.type === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-primary-600 text-white rounded-br-none'
            : 'bg-white text-gray-800 shadow-sm rounded-bl-none'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <span className={`text-xs mt-1 block ${isUser ? 'text-primary-100' : 'text-gray-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}
