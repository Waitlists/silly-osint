export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface LookupResult {
  email: string;
  google_account?: {
    exists: boolean;
    profile_picture?: string;
    display_name?: string;
    google_id?: string;
    last_edit?: string;
  };
  platforms: PlatformResult[];
  breaches: BreachResult[];
  reputation_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface PlatformResult {
  platform: string;
  exists: boolean;
  profile_url?: string;
  username?: string;
  additional_info?: any;
}

export interface BreachResult {
  name: string;
  domain: string;
  breach_date: string;
  added_date: string;
  pwn_count: number;
  description: string;
  data_classes: string[];
  verified: boolean;
}