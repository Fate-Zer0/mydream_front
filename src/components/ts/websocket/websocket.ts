import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    private stompClient: Client | null = null;
    private messageCallbacks: ((data: any) => void)[] = [];
    private statusListeners: ((connected: boolean) => void)[] = [];

    connect(user_id: string, token?: string) {
        if (this.isConnected()) {
            console.warn('Already connected');
            return;
        }

        const wsUrl = import.meta.env.VITE_WS_URL;
        const params = new URLSearchParams({ user_id, token: token || '' });
        const socket = new SockJS(`${wsUrl}?${params}`);

        this.stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log('[STOMP] ' + str),
            onConnect: (frame) => {
                console.log('✅ Connected:', frame);

                // 订阅公共频道
                this.stompClient.subscribe('/topic/public', (msg) => {
                    console.log('Public:', msg.body);
                });

                // 订阅私信（带订阅成功回调）
                this.stompClient.subscribe('/user/queue/private', (message) => {
                    const data = JSON.parse(message.body);
                    this.messageCallbacks.forEach(cb => cb(data));
                });

                // 通知状态变化
                this.statusListeners.forEach(cb => cb(true));
            },
            onStompError: (error) => {
                console.error('STOMP Error:', error);
            },
            onDisconnect: () => {
                console.log('Disconnected');
                this.statusListeners.forEach(cb => cb(false));
            },
            onWebSocketError: (error) => {
                console.error('WebSocket Error:', error);
            },
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            reconnectDelay: 5000,
        });

        this.stompClient.activate();
    }

    sendMessage(destination: string, body: any) {
        if (!this.stompClient?.active) return;

        try {
            this.stompClient.publish({
                destination,
                body: JSON.stringify(body),
            });
        } catch (err) {
            console.error('Send failed:', err);
        }
    }

    onMessage(callback: (data: any) => void) {
        this.messageCallbacks.push(callback);
    }

    offMessage(callback: (data: any) => void) {
        this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    }

    onStatusChange(listener: (connected: boolean) => void) {
        this.statusListeners.push(listener);
    }

    disconnect() {
        if (this.stompClient) {
            this.stompClient.deactivate();
            this.messageCallbacks = [];
            this.statusListeners = [];
            this.stompClient = null;
        }
    }

    isConnected(): boolean {
        return !!this.stompClient && this.stompClient.active;
    }
}

// 单例管理
let instance: WebSocketService | null = null;

class WebSocketServiceWrapper {
    static getInstance(): WebSocketService {
        if (!instance) {
            instance = new WebSocketService();
        }
        return instance;
    }
}

export default WebSocketServiceWrapper;