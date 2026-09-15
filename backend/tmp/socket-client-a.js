import { io } from 'socket.io-client'

const socket = io('http://localhost:3000', { query: { userId: 'testA' }, transports: ['websocket', 'polling'] })

socket.on('connect', () => {
  console.log('[clientA] connected', socket.id)
})

socket.on('getOnlineUsers', (users) => {
  console.log('[clientA] onlineUsers', users)
})

socket.on('newMessage', (msg) => {
  console.log('[clientA] newMessage', msg)
})

socket.on('disconnect', () => console.log('[clientA] disconnected'))
