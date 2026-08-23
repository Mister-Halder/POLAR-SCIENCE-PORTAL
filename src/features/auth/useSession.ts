import { useCallback, useEffect, useState } from "react";

import { readSession, writeSession, type SessionUser } from "./session";

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(readSession());
    setReady(true);
    const sync = () => setUser(readSession());
    window.addEventListener("moes-session-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("moes-session-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const signIn = useCallback((next: SessionUser) => writeSession(next), []);
  const signOut = useCallback(() => writeSession(null), []);

  return { user, ready, signIn, signOut };
}
