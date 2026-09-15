import { io } from 'socket.io-client'

const socket = io('http://localhost:3000', { query: { userId: 'testB' }, transports: ['websocket', 'polling'] })

socket.on('connect', () => {
  console.log('[clientB] connected', socket.id)
})

socket.on('getOnlineUsers', (users) => {
  console.log('[clientB] onlineUsers', users)
})

socket.on('newMessage', (msg) => {
  console.log('[clientB] newMessage', msg)
})

socket.on('disconnect', () => console.log('[clientB] disconnected'))
