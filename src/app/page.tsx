import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import HomeUI from './ui/home-ui';

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <HomeUI user={user} />
}
