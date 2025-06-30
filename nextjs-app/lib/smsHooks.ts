export const handleIncomingSMS = (message: string) => {
  if (message.startsWith('SHIFT')) {
    // Format: SHIFT clientName 01/07 09:00 11:00 dailyTasks
    // Parse and save to shifts
  } else if (message.startsWith('EXPENSE')) {
    // Format: EXPENSE 45.90 fuel "Trip to client"
    // Parse and save to expenses
  }
};
