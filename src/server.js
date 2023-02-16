import http from "http";
import express from "express";
import path from "path";
import webSocket, {WebSocketServer} from "ws";

const __dirname = path.resolve();
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/src/views");
app.use("/public", express.static(__dirname + "/src/public"));
console.log(__dirname);
app.get("/", (req, res) => res.render("home"));
const handleListen = () => console.log("Listening on http://localhost:3000");
// app.listen(3000, handleListen);

const server = http.createServer(app);
const wss = new WebSocketServer({server});

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    console.log("Connected to Browser!");
    socket.on("close", () => console.log("Disconnected from the Browser"));
    // 특정 소켓에서 메시지 받기
    socket.on("message", (message) => {
        sockets.forEach(aSocket => aSocket.send(message));
    });
    // 메시지를 브라우저로 전달
    socket.send("hello");
});

server.listen(3000, handleListen);
