import { LookupResult } from '../types';

export class OSINTService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
  }

  async lookupEmail(email: string): Promise<LookupResult> {
    const response = await fetch(`${this.baseUrl}/osint-lookup?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to perform lookup');
    }

    return await response.json();
  }
}

export const osintService = new OSINTService();