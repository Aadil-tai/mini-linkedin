// Quick database test - run this in your browser console
// This will check if your profile exists and what data it contains

const testProfile = async () => {
    // Import Supabase client
    const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
    const supabase = createClientComponentClient();

    try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('Current user:', user);

        if (!user) {
            console.log('❌ No user logged in');
            return;
        }

        // Try to get profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        console.log('Profile query result:', { profile, profileError });

        if (profileError) {
            console.log('❌ Profile error:', profileError);
            return;
        }

        if (profile) {
            console.log('✅ Profile found:', profile);
            console.log('Avatar URL:', profile.avatar_url);
            console.log('Name:', profile.first_name, profile.last_name);
        } else {
            console.log('❌ No profile found');
        }

    } catch (error) {
        console.error('❌ Test error:', error);
    }
};

// Run the test
testProfile();
