import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  roomId: string;
}

let userCount = 0;
let allSocket: User[] = [];

wss.on("connection", (socket) => {
  console.log("all socket", allSocket);
  //@ts-ignore

  userCount++;
  console.log(" user connected to webscoket server ", userCount);

  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message as unknown as string);
    if (parsedMessage.type === "join") {
      console.log("user joined room" + parsedMessage.payload.roomId);
      allSocket.push({
        socket,
        roomId: parsedMessage.payload.roomId,
      });
    }

    if (parsedMessage.type === "chat") {
      const currentUserRoom = allSocket.find(
        (x) => x.socket === socket,
      )?.roomId;
      console.log("current user room", currentUserRoom);

      allSocket.forEach((user) => {
        console.log("message send to room user", user.roomId, currentUserRoom);
        if (user.roomId === currentUserRoom) {
          user.socket.send("from server " + parsedMessage.payload.message);
        }
      });
    }
  });
});
