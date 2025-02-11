'use client'; // Do I need this?

import RatingLists from './ui/rating-lists';

export default function Home() {
  return (
    <div>
      <div className="mx-auto max-w-4xl border-x border-zinc min-h-screen">
        <div className="container mx-auto p-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Media Tracker</h1>
          <RatingLists />
        </div>
      </div>
    </div>
  );
}
