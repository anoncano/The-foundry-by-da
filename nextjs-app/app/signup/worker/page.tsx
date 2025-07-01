'use client';
import { useState } from 'react';
import WorkerWizard, { workerSteps } from '@/app/components/WorkerWizard';
import StepIndicator from '@/app/components/StepIndicator';

export default function WorkerSignupPage() {
  const [step, setStep] = useState(1);
  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Worker Signup</h1>
      <StepIndicator steps={workerSteps} current={step} />
      <WorkerWizard onStepChange={setStep} />
    </div>
  );
}
