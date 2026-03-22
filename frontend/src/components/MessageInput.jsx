import React from 'react'

const MessageInput = () => {
  return (
    <div className="p-4 border-t border-gray-300">
      <input
        type="text"
        placeholder="Type a message..."
        className="bg-slate-800 text-slate-300 placeholder:text-slate-500 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
    </div>
  )
}

export default MessageInput