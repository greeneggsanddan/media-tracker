'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AddDialog } from './ui/add-dialog';
import { SearchPopover } from './ui/search-popover';
import RatingLists from './ui/rating-lists';

import { example_shows } from './lib/data';

export default function Home() {
  const [queue, setQueue] = useState([]);
  const [items, setItems] = useState(example_shows)

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
        <SearchPopover items={items} setItems={setItems} />
        {/* <OrderedList tierName="Queue" items={example_shows} /> */}
        <div className="container mx-auto p-8">
          <h1 className="text-2xl font-bold mb-8">Rate Your Movies</h1>
          <RatingLists items={items} setItems={setItems} />
        </div>
        <h3>*Tier name*</h3>
        <hr className="border-zinc" />
        <TierGrid />
      </div>
    </div>
  );
}

function TierGrid({}) {
  const [thumbnails, setThumbnails] = useState([
    { id: 1, src: '/thumbnails/2001.jpg', alt: 'image1' },
    { id: 2, src: '/thumbnails/backtothefuture.jpg', alt: 'image2' },
    { id: 3, src: '/thumbnails/goodfellas.jpg', alt: 'image3' },
    { id: 4, src: '/thumbnails/lawrence.jpg', alt: 'image4' },
    { id: 5, src: '/thumbnails/princeofegypt.jpg', alt: 'image5' },
    { id: 6, src: '/thumbnails/princessbride.jpg', alt: 'image6' },
    { id: 7, src: '/thumbnails/psycho.jpg', alt: 'image7' },
    { id: 8, src: '/thumbnails/schindler.jpg', alt: 'image8' },
    { id: 9, src: '/thumbnails/spiritedaway.jpg', alt: 'image9' },
    { id: 10, src: '/thumbnails/virgin.jpg', alt: 'image10' },
  ]);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItemIndex === null) return;
    if (draggedItemIndex === index) return;

    const items = [...thumbnails];
    const draggedItem = items[draggedItemIndex];
    items.splice(draggedItemIndex, 1);
    items.splice(index, 0, draggedItem);

    setThumbnails(items);
    setDraggedItemIndex(index);
  };

  const handleDragEnd = () => setDraggedItemIndex(null);

  const tierList = thumbnails.map((thumbnail, index) => (
    <div
      key={thumbnail.id}
      className={`relative transition-transform ${
        draggedItemIndex === index ? 'opacity-50 scale-105' : ''
      }`}
      draggable="true"
      onDragStart={(e) => handleDragStart(e, index)}
      onDragOver={(e) => handleDragOver(e, index)}
      onDragEnd={handleDragEnd}
    >
      <img src={thumbnail.src} alt={thumbnail.src} width={120} height={160} />
      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity" />
    </div>
  ));

  return <div className="flex flex-wrap">{tierList}</div>;
}

// <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//   <main className="container mx-auto bg-gray-100 flex flex-col gap-8 row-start-2 items-center sm:items-start">
//     <Image
//       className=""
//       src="/next.svg"
//       alt="Next.js logo"
//       width={180}
//       height={38}
//       priority
//     />
//   </main>
// </div>
