import { createBrowserClient } from '@supabase/ssr';

export const PUBLIC_SUPABASE_URL =
	(typeof process !== 'undefined' && process.env?.PUBLIC_SUPABASE_URL) ||
	'https://ljsnccdmojrywjxnadvb.supabase.co';

export const PUBLIC_SUPABASE_ANON_KEY =
	(typeof process !== 'undefined' && process.env?.PUBLIC_SUPABASE_ANON_KEY) ||
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqc25jY2Rtb2pyeXdqeG5hZHZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4NjM3NjUsImV4cCI6MjEwNzQzOTc2NX0.eYTa48rk70u6zzn-LDppnPj1nNafGgPZTAczya8ePMk';

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
	if (typeof window === 'undefined') {
		return createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
	}
	if (!browserClient) {
		browserClient = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
	}
	return browserClient;
}
