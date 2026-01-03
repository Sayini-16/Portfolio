export const getTypingSpeed = (length: number): number => {
  if (length <= 0) return 60;

  const baseSpeed = 55;
  const minDuration = 0.9;
  const maxDuration = 4.5;
  const baseDuration = length / baseSpeed;
  const duration = Math.min(maxDuration, Math.max(minDuration, baseDuration));

  return Math.round(length / duration);
};
