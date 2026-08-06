// ============================================================
// REST API Service — Fetch wrapper for backend endpoints
// ============================================================

const API_HOST = import.meta.env.VITE_API_URL || import.meta.env.VITE_SOCKET_URL || '';
const BASE = `${API_HOST}/api`;

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  getGameByPin: (pin: string) => request<any>(`/games/${pin}`),
  getGameResults: (pin: string) => request<any>(`/games/${pin}/results`),
  getTexts: (language?: string, difficulty?: string) => {
    const params = new URLSearchParams();
    if (language) params.set('language', language);
    if (difficulty) params.set('difficulty', difficulty);
    return request<any>(`/texts?${params}`);
  },
  seedTexts: () => request<any>('/texts/seed', { method: 'POST' }),
  getPlayerStats: (playerId: string) => request<any>(`/stats/${playerId}`),
  getMatchHistory: (playerId?: string) => {
    const params = playerId ? `?playerId=${playerId}` : '';
    return request<any>(`/stats/history${params}`);
  },
};

export default api;
