"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketServer = void 0;
const ws_1 = require("ws");
const connection_1 = require("./connection");
const rooms_1 = require("./rooms");
const debug_1 = require("debug");
const debugLog = debug_1.debug("app:sockets");
class WebSocketServer {
    /**
     * Handle WebSocket connections
     */
    constructor(server) {
        this.rooms = new rooms_1.Rooms();
        this.connections = [];
        this.start = () => {
            debugLog("handling socket connections");
            // Handle new connections
            this.wss.on("connection", (socket) => {
                const connection = new connection_1.Connection(socket);
                // Send messages to message handler
                socket.on("message", (message) => {
                    const data = JSON.parse(message.toString());
                    this.handleMessage(connection, data);
                });
                // Handle closing connection
                socket.on("close", () => this.handleCloseConnection(connection));
            });
        };
        this.handleMessage = (connection, message) => {
            debugLog(`received message from connection ${connection.id}: %O`, message);
            switch (message.type) {
                case "connect":
                    this.handleServerConnection(connection, message);
                    break;
                case "chatMessage":
                    this.handleChatMessage(connection, message);
                    break;
                case "handPosition":
                    this.handleHandPositon(connection, message);
                default:
                    break;
            }
        };
        this.handleServerConnection = (connection, data) => {
            // give connection username
            connection.username = data.username;
            // add user to room
            data.roomId = data.roomId.toUpperCase(); // ensure room id is in all caps
            const room = this.rooms.getRoom(data.roomId) ||
                this.rooms.createRoom(data.roomId, connection);
            room.addConnection(connection);
            connection.room = room;
            // return room info to client
            const joinRoomData = {
                type: "joinRoom",
                client: {
                    userId: connection.id,
                    username: connection.username,
                },
                room: {
                    roomId: room.roomId,
                    users: room.getUsers(),
                    hostname: room.hostname,
                },
            };
            connection.emit(joinRoomData);
            // inform other room users that a new client has joined
            const userJoinedData = {
                type: "userJoined",
                user: {
                    userId: connection.id,
                    username: data.username,
                },
            };
            room.emit(userJoinedData, connection);
        };
        this.handleChatMessage = (connection, data) => {
            const chatMessageData = {
                type: "chatMessage",
                user: { userId: connection.id, username: connection.username },
                message: data.message,
            };
            connection.room.emit(chatMessageData);
        };
        this.handleHandPositon = (connection, data) => {
            const handPositionData = data;
            connection.room.emit(handPositionData, connection);
        };
        this.handleCloseConnection = (connection) => {
            this.connections = this.connections.filter((conn) => conn !== connection);
            if (connection.room) {
                // remove connection from room
                const room = connection.room;
                room.removeConnection(connection);
                // inform other room users
                const userLeftData = {
                    type: "userLeft",
                    user: {
                        userId: connection.id,
                        username: connection.username,
                    },
                    room: {
                        hostname: room.hostname,
                    },
                };
                room.emit(userLeftData, connection);
                // remove room from cache if no users
                if (connection.room.connectionsLength === 0) {
                    this.rooms.removeRoom(room);
                }
            }
        };
        debugLog("starting socket server");
        this.wss = new ws_1.Server({ server });
    }
}
exports.WebSocketServer = WebSocketServer;
