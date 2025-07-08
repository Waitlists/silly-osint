import { corsHeaders } from '../_shared/cors.ts';

interface GoogleAccountResult {
  exists: boolean;
  profile_picture?: string;
  display_name?: string;
  google_id?: string;
  last_edit?: string;
}

interface PlatformResult {
  platform: string;
  exists: boolean;
  profile_url?: string;
  username?: string;
  additional_info?: any;
}

interface BreachResult {
  name: string;
  domain: string;
  breach_date: string;
  added_date: string;
  pwn_count: number;
  description: string;
  data_classes: string[];
  verified: boolean;
}

interface LookupResult {
  email: string;
  google_account?: GoogleAccountResult;
  platforms: PlatformResult[];
  breaches: BreachResult[];
  reputation_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

// Enhanced Google account checking using multiple methods
async function checkGoogleAccount(email: string): Promise<GoogleAccountResult> {
  try {
    // Method 1: Check Google Photos API
    const photosResponse = await fetch(`https://picasaweb.google.com/data/entry/api/user/${email}?alt=json`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }).catch(() => null);

    if (photosResponse?.ok) {
      const data = await photosResponse.json();
      return {
        exists: true,
        display_name: data.entry?.gphoto$nickname?.$t || data.entry?.title?.$t,
        profile_picture: data.entry?.gphoto$thumbnail?.$t,
        google_id: data.entry?.gphoto$user?.$t,
        last_edit: data.entry?.updated?.$t
      };
    }

    // Method 2: Check Gmail existence via password reset
    const resetResponse = await fetch('https://accounts.google.com/_/signin/sl/lookup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: `continue=https://accounts.google.com/&Email=${encodeURIComponent(email)}&Passwd=&signIn=Sign+in&PersistentCookie=yes`
    }).catch(() => null);

    // Method 3: Check Google Calendar public API
    const calendarResponse = await fetch(`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(email)}`, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }).catch(() => null);

    // Method 4: Check Google+ legacy API
    const plusResponse = await fetch(`https://plus.google.com/+${email.split('@')[0]}`, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }).catch(() => null);

    // Determine existence based on multiple signals
    const exists = (resetResponse && resetResponse.status !== 404) || 
                   (calendarResponse && calendarResponse.ok) ||
                   (plusResponse && plusResponse.ok);

    return {
      exists: !!exists,
      display_name: exists ? email.split('@')[0] : undefined
    };
  } catch (error) {
    console.error('Error checking Google account:', error);
    return { exists: false };
  }
}

// Enhanced platform checking with more sophisticated methods
async function checkPlatforms(email: string): Promise<PlatformResult[]> {
  const username = email.split('@')[0];
  const platforms = [
    {
      name: 'GitHub',
      url: `https://github.com/${username}`,
      api_url: `https://api.github.com/users/${username}`,
      check_method: 'api'
    },
    {
      name: 'Twitter',
      url: `https://twitter.com/${username}`,
      check_method: 'head'
    },
    {
      name: 'Instagram',
      url: `https://instagram.com/${username}`,
      check_method: 'head'
    },
    {
      name: 'LinkedIn',
      url: `https://linkedin.com/in/${username}`,
      check_method: 'head'
    },
    {
      name: 'Reddit',
      url: `https://reddit.com/user/${username}`,
      api_url: `https://www.reddit.com/user/${username}/about.json`,
      check_method: 'api'
    },
    {
      name: 'YouTube',
      url: `https://youtube.com/@${username}`,
      check_method: 'head'
    },
    {
      name: 'TikTok',
      url: `https://tiktok.com/@${username}`,
      check_method: 'head'
    },
    {
      name: 'Pinterest',
      url: `https://pinterest.com/${username}`,
      check_method: 'head'
    },
    {
      name: 'Twitch',
      url: `https://twitch.tv/${username}`,
      api_url: `https://api.twitch.tv/helix/users?login=${username}`,
      check_method: 'api'
    },
    {
      name: 'Steam',
      url: `https://steamcommunity.com/id/${username}`,
      check_method: 'head'
    }
  ];

  const results: PlatformResult[] = [];

  for (const platform of platforms) {
    try {
      let exists = false;
      let profile_url = platform.url;
      let additional_info = {};

      if (platform.check_method === 'api' && platform.api_url) {
        const response = await fetch(platform.api_url, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }).catch(() => null);

        if (response?.ok) {
          exists = true;
          const data = await response.json();
          
          if (platform.name === 'GitHub') {
            additional_info = {
              public_repos: data.public_repos,
              followers: data.followers,
              created_at: data.created_at,
              bio: data.bio
            };
          } else if (platform.name === 'Reddit') {
            additional_info = {
              comment_karma: data.data?.comment_karma,
              link_karma: data.data?.link_karma,
              created_utc: data.data?.created_utc
            };
          }
        }
      } else {
        const response = await fetch(platform.url, {
          method: 'HEAD',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }).catch(() => null);

        exists = response?.ok && response.status === 200;
      }

      results.push({
        platform: platform.name,
        exists,
        profile_url: exists ? profile_url : undefined,
        username: exists ? username : undefined,
        additional_info: Object.keys(additional_info).length > 0 ? additional_info : undefined
      });
    } catch (error) {
      results.push({
        platform: platform.name,
        exists: false
      });
    }
  }

  return results;
}

// Enhanced breach checking using XposedOrNot API
async function checkBreaches(email: string): Promise<BreachResult[]> {
  try {
    // Primary: XposedOrNot API (free, no key required)
    const xposedResponse = await fetch(`https://api.xposedornot.com/v1/check-email/${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'SillyOSINT-Platform',
        'Accept': 'application/json'
      }
    }).catch(() => null);

    if (xposedResponse?.ok) {
      const data = await xposedResponse.json();
      if (data.breaches && Array.isArray(data.breaches)) {
        return data.breaches.map((breach: any) => ({
          name: breach.name || 'Unknown Breach',
          domain: breach.domain || 'unknown.com',
          breach_date: breach.breach_date || breach.date || '2023-01-01',
          added_date: breach.added_date || breach.date || '2023-01-01',
          pwn_count: breach.pwn_count || breach.exposed_records || 0,
          description: breach.description || 'Data breach detected',
          data_classes: breach.data_classes || breach.exposed_data || ['Email addresses'],
          verified: breach.verified !== false
        }));
      }
    }

    // Fallback: Try alternative breach APIs
    const leakCheckResponse = await fetch(`https://leakcheck.io/api/public?check=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'SillyOSINT-Platform'
      }
    }).catch(() => null);

    if (leakCheckResponse?.ok) {
      const data = await leakCheckResponse.json();
      if (data.found && data.sources) {
        return data.sources.map((source: any) => ({
          name: source.name || 'Data Breach',
          domain: source.domain || 'unknown.com',
          breach_date: source.date || '2023-01-01',
          added_date: source.date || '2023-01-01',
          pwn_count: source.entries || 0,
          description: `Data breach from ${source.name || 'unknown source'}`,
          data_classes: ['Email addresses', 'Passwords'],
          verified: true
        }));
      }
    }

    // If no breaches found, return empty array
    return [];
  } catch (error) {
    console.error('Error checking breaches:', error);
    return [];
  }
}

// Calculate reputation score and risk level
function calculateRisk(googleExists: boolean, platformCount: number, breachCount: number): { score: number, level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' } {
  let score = 50; // Base score

  // Google account adds legitimacy
  if (googleExists) score += 20;

  // Multiple platforms suggest real person
  score += Math.min(platformCount * 5, 25);

  // Breaches reduce score significantly
  score -= breachCount * 15;

  // Ensure score is between 0-100
  score = Math.max(0, Math.min(100, score));

  let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  if (score >= 80) level = 'LOW';
  else if (score >= 60) level = 'MEDIUM';
  else if (score >= 30) level = 'HIGH';
  else level = 'CRITICAL';

  return { score, level };
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email parameter is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Perform all lookups in parallel
    const [googleAccount, platforms, breaches] = await Promise.all([
      checkGoogleAccount(email),
      checkPlatforms(email),
      checkBreaches(email)
    ]);

    // Calculate risk assessment
    const platformsFound = platforms.filter(p => p.exists).length;
    const { score, level } = calculateRisk(googleAccount.exists, platformsFound, breaches.length);

    const result: LookupResult = {
      email,
      google_account: googleAccount,
      platforms,
      breaches,
      reputation_score: score,
      risk_level: level
    };

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in OSINT lookup:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});