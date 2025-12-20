export const DICE_SHUFFLE_AUDIO_PATH = "/audio/dice_shuffle.ogg";
export const DICE_THROW_AUDIO_PATH = "/audio/dice_throw.ogg";
export const ROBBER_AUDIO_PATH = "/audio/robber.mp3";

export function playAudio(audioPath: string): void {
  const audio = new Audio(audioPath);
  audio.play().catch(() => {
    // Silently handle autoplay restrictions or loading errors
  });
}

