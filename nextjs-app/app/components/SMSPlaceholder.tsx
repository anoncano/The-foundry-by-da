'use client';
import { useState } from 'react';
import { handleIncomingSMS } from '@/lib/smsHooks';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

export default function SMSPlaceholder() {
  const [incoming, setIncoming] = useState('');
  const [outgoing, setOutgoing] = useState('');
  const [to, setTo] = useState('');

  const sendIncoming = () => {
    handleIncomingSMS(incoming);
    setIncoming('');
  };

  const sendOutgoing = async () => {
    if (!to || !outgoing) return;
    await addDoc(collection(db, 'messages'), {
      to,
      body: outgoing,
      cost: 0.07,
      status: 'queued',
    });
    setOutgoing('');
    setTo('');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">Simulate Incoming SMS</h2>
        <input
          className="border p-2"
          placeholder="Type inbound message"
          value={incoming}
          onChange={(e) => setIncoming(e.target.value)}
        />
        <button onClick={sendIncoming} className="bg-blue-500 text-white p-2">
          Process Incoming
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">Send Outbound SMS</h2>
        <input
          className="border p-2"
          placeholder="Recipient number"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Message body"
          value={outgoing}
          onChange={(e) => setOutgoing(e.target.value)}
        />
        <button onClick={sendOutgoing} className="bg-blue-500 text-white p-2">
          Queue Outbound SMS
        </button>
      </div>
    </div>
  );
}
