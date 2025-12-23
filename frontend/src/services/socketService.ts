import { io, Socket } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

class SocketService {
  private socket: Socket | null = null;
  private messageHandlers: Array<(data: any) => void> = [];

  connect() {
    if (this.socket?.connected) {
      console.log('[Socket] Already connected');
      return;
    }

    console.log('[Socket] Connecting to:', BACKEND_URL);
    this.socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
    });

    this.socket.on('message', (data) => {
      console.log('[Socket] Received message:', data);
      this.messageHandlers.forEach(handler => handler(data));
    });

    this.socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('[Socket] Disconnected manually');
    }
  }

  sendMessage(message: string) {
    if (!this.socket?.connected) {
      console.error('[Socket] Not connected, cannot send message');
      return;
    }

    console.log('[Socket] Sending message:', message);
    this.socket.emit('user_message', { message });
  }

  onMessage(handler: (data: any) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
