const NEST_API_URL = import.meta.env.VITE_NEST_API_URL ?? 'http://localhost:3001';

export interface LaserShareSession {
  ok: true;
  clientName: string;
  operatorFirstName: string;
  expiresAt: string;
  answers: Record<string, string | number>;
  skippedKeys: string[];
}

export interface SaveLaserShareStepPayload {
  token: string;
  updates?: Record<string, unknown>;
  skippedKeys?: string[];
  completeSession?: boolean;
}

async function parseErrorMessage(res: Response): Promise<string> {
  const detail = await res.json().catch(() => null);
  return detail?.message ?? `HTTP ${res.status}`;
}

export async function fetchLaserShareSession(token: string): Promise<LaserShareSession> {
  const res = await fetch(`${NEST_API_URL}/laser-share/session?token=${encodeURIComponent(token)}`);
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res));
  }
  return res.json();
}

export async function saveLaserShareSessionStep(
  payload: SaveLaserShareStepPayload,
): Promise<{ ok: true; skippedKeys: string[] }> {
  const res = await fetch(`${NEST_API_URL}/laser-share/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res));
  }
  return res.json();
}
