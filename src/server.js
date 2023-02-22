import http from "http";
import express from "express";
import path from "path";
import {Server} from "socket.io";
import {instrument} from "@socket.io/admin-ui";
// import webSocket, {WebSocketServer} from "ws";

const __dirname = path.resolve();
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/src/views");
app.use("/public", express.static(__dirname + "/src/public"));
console.log(__dirname);
app.get("/", (req, res) => res.render("home"));
const handleListen = () => console.log("Listening on http://localhost:3000");
// app.listen(3000, handleListen);

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true,
    }
});

instrument(wsServer, {
   auth: false
});

function publicRooms() {
    const {sockets: {adapter: {sids, rooms}}} = wsServer;

    const publicRooms = [];
    rooms.forEach((_, key, map) => {
        if(sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    })
    return publicRooms;
    // const sids = wsServer.sockets.adapter.sids;
    // const rooms = wsServer.sockets.adapter.rooms;
}

function countRoom(roomName) {
    returnwsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
    socket.on("join_room", (roomName) => {
        socket.join(roomName);
        socket.to(roomName).emit("welcome")
    });
    socket.on("offer", (offer, roomName) => {
        socket.to(roomName).emit("offer", offer);
    })
    socket.on("answer", (answer, roomName) => {
        socket.to(roomName).emit("answer", answer);
    })
    socket.on("ice", (ice, roomName) => {
        socket.to(roomName).emit("ice", ice);
    });
})

httpServer.listen(3000, handleListen);

// wsServer.on("connection", (socket) => {
//     console.log(socket);
//     socket["nickname"] = "Anon";
//     socket.onAny((event) => {
//         console.log(`Socket Event:${event}`);
//     })
//     // socket.on("enter_room", (msg) => console.log(msg));
//     socket.on("enter_room", (roomName, done) => {
//         // console.log(socket.id);
//         console.log(socket.rooms);
//         socket.join(roomName);
//         console.log(socket.rooms);
//         done();
//         socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
//         wsServer.sockets.emit("room_change", publicRooms());
//         // setTimeout(() => {
//         //     console.log("hello from the backend");
//         //     done();
//         // }, 15000)
//     })
//     socket.on("disconnecting", () => {
//         socket.rooms.forEach((room) => socket.to(room).emit("bye"), socket.nickname, countRoom(room) -1);
//     })
//     socket.on("disconnect", () => {
//         wsServer.sockets.emit("room_change", publicRooms());
//     })
//     socket.on("new_message", (msg, room, done) => {
//         socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
//         done();
//     })
//     socket.on("nickname", (nickname) => (socket["nickname"] = nickname))
// })
// const wss = new WebSocketServer({server});
//
// const sockets = [];
//
// wss.on("connection", (socket) => {
//     sockets.push(socket);
//     socket["nickname"] = "Anon";
//     console.log("Connected to Browser!");
//     socket.on("close", () => console.log("Disconnected from the Browser"));
//     // 특정 소켓에서 메시지 받기
//     socket.on("message", (msg) => {
//         const message = JSON.parse(msg);
//         switch (message.type) {
//             case "new_message":
//                 sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
//             case "nickname":
//                 socket["nickname"] = message.payload;
//                 // console.log(parsed.payload);
//         }
//
//         // if (parsed.type === "new_message") {
//         //     sockets.forEach(aSocket => aSocket.send(parsed.payload));
//         // } else if (parsed.type === "nickname") {
//         //     console.log(parsed.payload);
//         // }
//     });
//     // 메시지를 브라우저로 전달
//     socket.send("hello");
// });
