'use client';
import { useState } from 'react';
import { handleIncomingSMS } from '@/lib/smsHooks';

export default function SMSPlaceholder() {
  const [message, setMessage] = useState('');

  const send = () => {
    handleIncomingSMS(message);
    setMessage('');
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        className="border p-2"
        placeholder="Type SMS message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={send} className="bg-blue-500 text-white p-2">
        Simulate Incoming SMS
      </button>
    </div>
  );
}
