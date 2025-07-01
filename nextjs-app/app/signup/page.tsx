'use client';
import { useState } from 'react';
import ParticipantWizard, { participantSteps } from '../components/ParticipantWizard';
import WorkerWizard, { workerSteps } from '../components/WorkerWizard';
import StepIndicator from '../components/StepIndicator';

export default function SignUpPage() {
  const [role, setRole] = useState<'select' | 'participant' | 'worker'>('select');
  const [step, setStep] = useState(0); // wizard step
  const steps =
    role === 'participant'
      ? ['Choose Role', ...participantSteps]
      : role === 'worker'
      ? ['Choose Role', ...workerSteps]
      : ['Choose Role'];

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div className="w-full max-w-xl">
        <StepIndicator steps={steps} current={step === 0 ? 1 : 1 + step} />
        {role === 'select' && (
          <div className="flex flex-col items-center gap-4 p-6 border rounded bg-white">
            <h1 className="text-2xl font-bold">Join The Foundry</h1>
            <button className="bg-blue-600 text-white p-3 rounded w-64" onClick={() => setRole('participant')}>
              I&apos;m a Participant
            </button>
            <button className="bg-green-600 text-white p-3 rounded w-64" onClick={() => setRole('worker')}>
              I&apos;m a Worker
            </button>
          </div>
        )}
        {role === 'participant' && (
          <div className="space-y-4">
            <ParticipantWizard onStepChange={setStep} onComplete={() => setStep(participantSteps.length)} />
            <button className="text-blue-600 underline" onClick={() => { setRole('select'); setStep(0); }}>
              &larr; Back to role selection
            </button>
          </div>
        )}
        {role === 'worker' && (
          <div className="space-y-4">
            <WorkerWizard onStepChange={setStep} onComplete={() => setStep(workerSteps.length)} />
            <button className="text-blue-600 underline" onClick={() => { setRole('select'); setStep(0); }}>
              &larr; Back to role selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
