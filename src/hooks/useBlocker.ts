import { useStrictModeStore } from "../store/useStrictModeStore";
import { useTimerStore } from "../store/useTimerStore";
import { createWindowsHostsScript } from "../utils/blockerUtils";

export function useBlocker() {
  const blockedSites = useStrictModeStore((state) => state.blockedSites);
  const enabled = useStrictModeStore((state) => state.enabled);
  const lockedResetAttempts = useStrictModeStore(
    (state) => state.lockedResetAttempts
  );
  const recordLockedResetAttempt = useStrictModeStore(
    (state) => state.recordLockedResetAttempt
  );
  const status = useTimerStore((state) => state.status);
  const mode = useTimerStore((state) => state.mode);

  const isStrictSessionActive = enabled && status === "running" && mode === "work";

  return {
    blockedSites,
    enabled,
    generatedScript: createWindowsHostsScript(blockedSites),
    isStrictSessionActive,
    lockedResetAttempts,
    recordLockedResetAttempt
  };
}
