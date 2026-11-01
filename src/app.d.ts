import type { SupabaseClient, Session, User } from '@supabase/supabase-js';

export interface UserProfile {
	id: string;
	email: string;
	full_name: string | null;
	phone: string | null;
	avatar_url: string | null;
	role: 'customer' | 'partner' | 'admin';
	company_code: string;
	status: number;
	created_date: string;
}

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
			profile: UserProfile | null;
		}
		interface PageData {
			session: Session | null;
			user: User | null;
			profile?: UserProfile | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
