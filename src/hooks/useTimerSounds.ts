import { useEffect, useRef } from "react";

import { useAudioSettingsStore } from "../store/useAudioSettingsStore";
import { useTimerStore } from "../store/useTimerStore";

type WebAudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

export function useTimerSounds() {
  const enabled = useAudioSettingsStore((state) => state.enabled);
  const volume = useAudioSettingsStore((state) => state.volume);
  const lastCompletedTimerEvent = useTimerStore(
    (state) => state.lastCompletedTimerEvent
  );
  const playedEventIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      !enabled ||
      !lastCompletedTimerEvent ||
      playedEventIdRef.current === lastCompletedTimerEvent.id
    ) {
      return;
    }

    playedEventIdRef.current = lastCompletedTimerEvent.id;
    playTimerSound({
      isWorkSession: lastCompletedTimerEvent.mode === "work",
      volume
    });
  }, [enabled, lastCompletedTimerEvent, volume]);
}

function playTimerSound({
  isWorkSession,
  volume
}: {
  isWorkSession: boolean;
  volume: number;
}): void {
  const AudioContextConstructor =
    window.AudioContext ?? (window as WebAudioWindow).webkitAudioContext;

  if (!AudioContextConstructor) {
    return;
  }

  const context = new AudioContextConstructor();
  const gain = context.createGain();
  const firstTone = context.createOscillator();
  const secondTone = context.createOscillator();
  const now = context.currentTime;
  const safeVolume = Math.min(1, Math.max(0, volume));

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(safeVolume * 0.18, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
  gain.connect(context.destination);

  firstTone.type = "sine";
  firstTone.frequency.setValueAtTime(isWorkSession ? 880 : 523.25, now);
  firstTone.connect(gain);
  firstTone.start(now);
  firstTone.stop(now + 0.2);

  secondTone.type = "sine";
  secondTone.frequency.setValueAtTime(isWorkSession ? 1174.66 : 659.25, now);
  secondTone.connect(gain);
  secondTone.start(now + 0.24);
  secondTone.stop(now + 0.48);

  window.setTimeout(() => {
    void context.close();
  }, 700);
}
