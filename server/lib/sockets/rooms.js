"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rooms = exports.Room = void 0;
const debug_1 = require("debug");
const debugLog = debug_1.debug("app:rooms");
class Room {
    constructor(roomId, host) {
        this.connections = [];
        this.roomId = roomId;
        this.host = host;
        debugLog(`created a new room with id`, roomId);
    }
    get connectionsLength() {
        return this.connections.length;
    }
    get hostname() {
        return this.host.username;
    }
    addConnection(connection) {
        debugLog(`adding connection ${connection.id} to room ${this.roomId}`);
        connection.room = this;
        this.connections.push(connection);
        debugLog(`added connection ${connection.id} to room ${this.roomId}`);
    }
    removeConnection(connection) {
        debugLog(`removing connection ${connection.id} from room ${this.roomId}`);
        // make new host if removing current host
        if (connection === this.host) {
            this.host = this.connections[0];
        }
        // remove connection
        this.connections = this.connections.filter((conn) => conn !== connection);
        debugLog(`removed connection ${connection.id} from room ${this.roomId}`);
    }
    // return usernames of all room users
    getUsers() {
        // debug log number of connections in room
        const count = this.connections.length;
        const moreThanOne = count > 1;
        debugLog(`${count} user${moreThanOne ? "s" : ""} ${moreThanOne ? "are" : "is"} connected to room`, this.roomId);
        // return users in room
        return this.connections.map((conn) => ({
            userId: conn.id,
            username: conn.username,
        }));
    }
    /**
     * Send  data to all room connections.
     * Exclude any connections as required
     */
    emit(data, exclude) {
        debugLog(`emitting data to room ${this.roomId}: %O`, data);
        this.connections.forEach((conn) => {
            if (exclude && exclude === conn)
                return;
            conn.emit(data);
        });
    }
}
exports.Room = Room;
class Rooms {
    constructor() {
        this.rooms = [];
        this.getRoom = (roomId) => {
            debugLog("requested room", roomId);
            const room = this.rooms.find((room) => room.roomId === roomId);
            debugLog(room ? `found room ${roomId}` : `could not find room ${roomId}`);
            debugLog("rooms", this.rooms);
            return room;
        };
        this.createRoom = (roomId, host) => {
            const room = new Room(roomId, host);
            this.rooms.push(room);
            return room;
        };
        this.removeRoom = (room) => {
            debugLog("removing room", room.roomId);
            debugLog("rooms", this.rooms);
            this.rooms = this.rooms.filter((r) => r.roomId !== room.roomId);
            debugLog("rooms", this.rooms);
            debugLog("removed room", room.roomId);
        };
    }
}
exports.Rooms = Rooms;
