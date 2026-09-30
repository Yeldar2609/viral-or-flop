let context: AudioContext | undefined;
export function enableSound(): void {
  context ??= new AudioContext();
  void context.resume();
}
export function playResult(won: boolean): void {
  if (!context || context.state !== "running") return;
  const now = context.currentTime;
  for (let index = 0; index < 3; index++) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = (won ? 440 : 220) * (won ? 1 + index * 0.25 : 1 - index * 0.15);
    gain.gain.setValueAtTime(0.055, now + index * 0.09);
    gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.09 + 0.14);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now + index * 0.09);
    oscillator.stop(now + index * 0.09 + 0.15);
  }
}
