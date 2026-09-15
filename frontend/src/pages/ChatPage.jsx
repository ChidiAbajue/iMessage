import React from 'react'
import toast from 'react-hot-toast'

export default function ChatPage() {
  return (
    <div>
      ChatPage
      <button onClick={() => toast.success("You clicked")}>Click Me</button>
    </div>
  )
}
