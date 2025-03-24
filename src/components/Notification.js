import React from 'react';

function Notification({ id, message, type, onClose }) {
  return (
    <div 
      key={id}
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white`}
    >
      <div className="flex items-center justify-between">
        <p>{message}</p>
        <button 
          onClick={() => onClose(id)} 
          className="ml-4 text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Notification; 