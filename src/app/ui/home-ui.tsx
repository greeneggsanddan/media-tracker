'use client'

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Rating } from '../lib/types';
import LogOutButton from './logout-button';
import SearchBar from './search-bar';
import RatingLists from './rating-lists';
import SearchPopover from './search-popover';

export default function HomeUI({ user }: { user: User }) {
  const [ratings, setRatings] = useState<Rating[]>([]);

  return (
    <div>
      <div className="mx-auto max-w-[946px] border-x border-zinc min-h-screen">
        <div className="container mx-auto p-8">
          <div className="flex justify-between w-full">
            <h1 className="text-3xl font-bold tracking-tight mb-4">
              Media Tracker
            </h1>
              <LogOutButton user={user} />
          </div>
          <SearchPopover user={user} ratings={ratings}  setRatings={setRatings} />
          {/* <SearchBar user={user} ratings={ratings} setRatings={setRatings} /> */}
          <RatingLists user={user} ratings={ratings} setRatings={setRatings} />
        </div>
      </div>
    </div>
  );
}
