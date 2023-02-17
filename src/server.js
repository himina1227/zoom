import http from "http";
import express from "express";
import path from "path";
import {Server} from "socket.io";
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
const wsServer = new Server(httpServer);

wsServer.on("connection", (socket) => {
    console.log(socket);
    socket.onAny((event) => {
        console.log(`Socket Event:${event}`);
    })
    // socket.on("enter_room", (msg) => console.log(msg));
    socket.on("enter_room", (roomName, done) => {
        // console.log(socket.id);
        console.log(socket.rooms);
        socket.join(roomName);
        console.log(socket.rooms);
        done();
        socket.to(roomName).emit("welcome");
        // setTimeout(() => {
        //     console.log("hello from the backend");
        //     done();
        // }, 15000)
    })
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye"));
    })
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", msg);
        done();
    })
})

httpServer.listen(3000, handleListen);
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
