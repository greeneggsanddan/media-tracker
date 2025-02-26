'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Rating } from '../lib/types';
import LogOutButton from './logout-button';
import RatingLists from './rating-lists';
import SearchPopover from './search-popover';

export default function HomeUI({ user }: { user: User }) {
  const [ratings, setRatings] = useState<Rating[]>([]);

  return (
    <>
      <header className="mx-auto flex justify-between items-center px-4 py-2 border-b">
        <h1 className="text-3xl font-bold tracking-tight">Media Tracker</h1>
        <LogOutButton />
      </header>
      <div className="mx-auto md:max-w-[930px] md:border-x min-h-screen">
        <div className="px-2 md:px-8 py-4">
          <SearchPopover
            user={user}
            ratings={ratings}
            setRatings={setRatings}
          />
          <RatingLists user={user} ratings={ratings} setRatings={setRatings} />
        </div>
      </div>
    </>
  );
}
