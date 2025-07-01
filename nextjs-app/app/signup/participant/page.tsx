'use client';
import { useState } from 'react';
import ParticipantWizard, { participantSteps } from '@/app/components/ParticipantWizard';
import StepIndicator from '@/app/components/StepIndicator';

export default function ParticipantSignup() {
  const [step, setStep] = useState(1);
  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Participant Signup</h1>
      <StepIndicator steps={participantSteps} current={step} />
      <ParticipantWizard onStepChange={setStep} />
    </div>
  );
}
