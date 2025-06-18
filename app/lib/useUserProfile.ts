import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { supabase, User } from '@/lib/supabase';

export const useUserProfile = () => {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncUser = async (clerkUser: any) => {
      if (!clerkUser) return;
      setLoading(true);
      setError(null);
      try {
        const authType = clerkUser.externalAccounts?.[0]?.provider || 'email';
        const email = clerkUser.emailAddresses?.[0]?.emailAddress || '';
        const firstName = clerkUser.firstName || '';
        const lastName = clerkUser.lastName || '';
        const avatarUrl = clerkUser.imageUrl || '';
        const createdAt = clerkUser.createdAt ? new Date(clerkUser.createdAt).toISOString() : undefined;
        const lastSignInAt = clerkUser.lastSignInAt ? new Date(clerkUser.lastSignInAt).toISOString() : undefined;
        const updatedAt = clerkUser.updatedAt ? new Date(clerkUser.updatedAt).toISOString() : undefined;

        const upsertData: User = {
          clerk_user_id: clerkUser.id,
          auth_type: authType,
          email,
          first_name: firstName,
          last_name: lastName,
          avatar_url: avatarUrl,
          created_at: createdAt,
          last_sign_in_at: lastSignInAt,
          updated_at: updatedAt,
        };

        const { data, error } = await supabase
          .from('users')
          .upsert(upsertData, { onConflict: 'clerk_user_id' })
          .select()
          .single();

        if (error) {
          setError(error.message);
        } else {
          setProfile(data as User);
        }
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && user) {
      syncUser(user);
    } else {
      setLoading(false);
    }
  }, [user, isLoaded]);

  return { user, profile, loading, error };
}; 