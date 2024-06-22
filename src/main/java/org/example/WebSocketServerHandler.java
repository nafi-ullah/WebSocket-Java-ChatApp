package org.example;

import org.java_websocket.server.WebSocketServer;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import com.google.gson.Gson;

import java.net.InetSocketAddress;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class WebSocketServerHandler extends WebSocketServer {
    private static final int PORT = 1234;
    private static Map<WebSocket, String> clients = Collections.synchronizedMap(new HashMap<>());
    private static Gson gson = new Gson();

    public WebSocketServerHandler() {
        super(new InetSocketAddress(PORT));
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        System.out.println("New connection: " + conn.getRemoteSocketAddress());
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        clients.remove(conn);
        broadcastActiveUsers();
        System.out.println("Closed connection: " + conn.getRemoteSocketAddress());
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        if (!clients.containsKey(conn)) {
            clients.put(conn, message); // Assuming the first message from the client is the username
            broadcastActiveUsers();
        } else {
            broadcastMessage(message, clients.get(conn), null);
        }
        System.out.println("Message from client: " + message);
    }

    @Override
    public void onError(WebSocket conn, Exception ex) {
        if (conn != null) {
            System.err.println("An error occurred on connection: " + conn.getRemoteSocketAddress() + ":" + ex);
        } else {
            System.err.println("An error occurred on the WebSocket server: " + ex);
        }
    }

    @Override
    public void onStart() {
        System.out.println("Server started on port: " + getPort());
    }

    private void broadcastMessage(String userMessage, String username, String serverMessage) {
        String activeUsers = String.join(", ", clients.values());
        MessageObject messageObject = new MessageObject(username, userMessage, serverMessage, activeUsers);
        String messageJson = gson.toJson(messageObject);
        synchronized (clients) {
            for (WebSocket client : clients.keySet()) {
                client.send(messageJson);
            }
        }
    }

    private void broadcastActiveUsers() {
        broadcastMessage(null, null, "Changes in Conversation Participants");
    }

    public static void main(String[] args) {
        WebSocketServer server = new WebSocketServerHandler();
        server.start();
        System.out.println("WebSocket server started on port: " + PORT);
    }

    private class MessageObject {
        private String username;
        private String userMessage;
        private String serverMessage;
        private String activeUsers;

        public MessageObject(String username, String userMessage, String serverMessage, String activeUsers) {
            this.username = username;
            this.userMessage = userMessage;
            this.serverMessage = serverMessage;
            this.activeUsers = activeUsers;
        }
    }
}
