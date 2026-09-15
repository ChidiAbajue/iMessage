import express from "express"
import http from "http"
import { Server } from "socket.io"

const app = express()
const server = http.createServer(app)
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
    },
})

//online users map {userId: socketId}
const userSocketMap = {}
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId

    if(userId) userSocketMap[userId] = socket.id
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
    console.log('[socket] connection', { socketId: socket.id, userId })
    
    socket.on("disconnect", () => {
        if(userId) delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
        console.log('[socket] disconnect', { socketId: socket.id, userId })
    
    })
})
function getReceiverSocketId(userId){
    return userSocketMap[userId]
}


export {app, server, io, getReceiverSocketId}