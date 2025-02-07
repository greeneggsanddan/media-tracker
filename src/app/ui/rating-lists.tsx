import Image from 'next/image';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Star } from 'lucide-react';
import { SearchPopover } from './search-popover';

function WatchListHeader({ items, setItems }) {
  return (
    <div className='flex justify-between items-end w-full'>
      <h2 className='text-2xl font-semibold tracking-tight'>Watchlist</h2>
      <SearchPopover items={items} setItems={setItems} />
    </div>
  )
}

export default function RatingLists({ items, setItems }) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const ratings = [null, 5, 4, 3, 2, 1];

  const handleDragStart = (item, index) => {
    setDraggedItem(item);
    setDraggedItemIndex(index);
    console.log('draggedItemIndex:', index);
  };

  const handleDragOver = (e, rating, targetItem?, index?) => {
    e.preventDefault();

    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const updatedItem = { ...draggedItem, user_rating: rating };
    let updatedItems = [...items];
    let updatedIndex;

    // Remove the dragged item from its current position
    updatedItems.splice(draggedItemIndex, 1);

    if (targetItem) {
      // Insert at specific position
      updatedIndex = index;
    } else {
      const ratedItems = updatedItems.filter(
        (item) => item.user_rating === rating
      );
      if (ratedItems.length > 0) {
        // Add to end of exisitng rating group
        // You need to add an invisible target (and then clean up statements)
        const lastItem = ratedItems[ratedItems.length - 1];
        updatedIndex =
          updatedItems.findIndex((item) => item.id === lastItem.id) + 1;
      } else if (rating) {
        // Add to empty rating group
        const itemsRatedHigher = updatedItems.filter(
          (item) => item.user_rating > rating
        ).length;
        const itemsInQueue = updatedItems.filter(
          (item) => item.user_rating === null
        ).length;
        updatedIndex = itemsRatedHigher + itemsInQueue;
      } else {
        // Add to an empty queue
        updatedIndex = 0;
      }
    }
    console.log('updatedIndex:', updatedIndex);

    // Insert the dragged item into its new position
    updatedItems.splice(updatedIndex, 0, updatedItem);

    setDraggedItemIndex(updatedIndex);
    setItems(updatedItems);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDraggedItemIndex(null);
  };

  return (
    <div>
      {ratings.map((rating) => (
        <div
          key={rating ? rating : 'queue'}
          // onDragOver={(e) => handleDragOver(e, rating)}
          // onDrop={}
        >
          <div className="flex">
            {rating
              ? Array.from({ length: rating }, () => (
                // eslint-disable-next-line react/jsx-key
                <Star fill='black' strokeWidth={0} />
                ))
              : <WatchListHeader items={items} setItems={setItems} />}
          </div>
          <Separator className="my-2" />
          <div className="flex flex-wrap gap-2 pb-6">
            {items.map(
              (item, index) =>
                item.user_rating === rating && (
                  <div
                    key={item.id}
                    className={`h-[180px] w-[120px] relative transition-transform drop-shadow ${
                      draggedItemIndex === index ? 'opacity-50 scale-105' : ''
                    }`}
                    draggable
                    onDragStart={() => handleDragStart(item, index)}
                    onDragOver={(e) => handleDragOver(e, rating, item, index)}
                    // onDrop={}
                    onDragEnd={handleDragEnd}
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w154${item.poster_path}`}
                      alt="lorem ipsum"
                      fill
                      className="rounded-md object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity" />
                  </div>
                )
            )}
            {/* {(!items ||
              items.filter((item) => item.user_rating === rating).length ===
                0) && (
              <div
                className="p-3 border-2 border-dashed border-gray-200 rounded text-gray-400 text-center"
                onDragOver={(e) => handleDragOver(e, rating)}
                // onDrop={}
              >
                Drop items here
              </div>
            )} */}
          </div>
        </div>
      ))}
    </div>
  );
}
