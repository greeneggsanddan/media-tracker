import { redirect } from 'next/navigation';
import RatingLists from './ui/rating-lists';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div>
      <div className="mx-auto max-w-4xl border-x border-zinc min-h-screen">
        <div className="container mx-auto p-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Media Tracker</h1>
          <RatingLists user={user} />
        </div>
      </div>
    </div>
  );
}
