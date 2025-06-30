'use client';
import { useState } from 'react';

export default function ParticipantWizard() {
  const [step, setStep] = useState(1);
  return (
    <div>
      <p>Participant Wizard - Step {step}</p>
      <button onClick={() => setStep(step + 1)}>Next</button>
    </div>
  );
}
