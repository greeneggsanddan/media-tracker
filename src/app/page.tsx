'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AddDialog } from './ui/add-dialog';
import { SearchPopover } from './ui/search-popover';
import RatingLists from './ui/rating-lists';

import { example_shows } from './lib/data';

export default function Home() {
  const [items, setItems] = useState(example_shows);

  // const handleUpdate = async (updatedItems) => {
  //   try {
  //     // Example API call to save changes
  //     await fetch('/api/update-ratings', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ items: updatedItems }),
  //     });
  //     console.log('Ratings updated:', updatedItems);
  //   } catch (error) {
  //     console.error('Failed to update ratings:', error);
  //   }
  // };

  return (
    <div>
      <div className="mx-auto max-w-4xl border-x border-zinc min-h-screen">
        <div className="container mx-auto p-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Media Tracker</h1>
          <RatingLists items={items} setItems={setItems} />
        </div>
      </div>
    </div>
  );
}
