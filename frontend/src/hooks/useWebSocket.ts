import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_URL = `${window.location.origin}/ws`;

const eventMap: Record<string, string[]> = {
  CLIENT_CREATED: ["clients"],
  CLIENT_UPDATED: ["clients"],
  CLIENT_DELETED: ["clients"],
  CHARGE_ADDED: ["clients", "movements"],
  PAYMENT_ADDED: ["clients", "movements"],
  NOTIFICATION_CREATED: ["notifications"],
  NOTIFICATION_READ: ["notifications"],
  NOTIFICATIONS_ALL_READ: ["notifications"],
  CONFIG_UPDATED: ["config"],
};

export function useWebSocket() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!user?.token) return;

    const token = user.token;

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe("/topic/events", (message) => {
          try {
            const { type } = JSON.parse(message.body);
            const keys = eventMap[type];
            if (keys) {
              keys.forEach((key) => qc.invalidateQueries({ queryKey: [key] }));
            }
          } catch {
            /* ignore malformed messages */
          }
        });
      },
      onStompError: () => {},
      onWebSocketClose: () => {},
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [user?.token]);
}
