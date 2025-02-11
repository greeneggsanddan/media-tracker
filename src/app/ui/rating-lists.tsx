import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { Star } from 'lucide-react';
import { SearchPopover } from './search-popover';
import { Rating, TvProps } from '@/app/lib/types';
import { fetchRatings } from '@/app/lib/data';

function WatchListHeader({ ratings, setRatings }: TvProps) {
  return (
    <div className="flex justify-between items-end w-full">
      <h2 className="text-2xl font-semibold tracking-tight">Watchlist</h2>
      <SearchPopover ratings={ratings} setRatings={setRatings} />
    </div>
  );
}

export default function RatingLists() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [draggedItem, setDraggedItem] = useState<Rating | null>(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const ratingValues = [null, 5, 4, 3, 2, 1];

  // Load data from the database
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const userRatings = await fetchRatings(
          '410544b2-4001-4271-9855-fec4b6a6442a'
        );
        if (mounted) setRatings(userRatings);
      } catch (error) {
        console.error('Error loading ratings:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const handleDragStart = (item: Rating, index: number) => {
    setDraggedItem(item);
    setDraggedItemIndex(index);
    console.log('draggedItemIndex:', index);
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    rating: number | null,
    targetItem?: Rating,
    index?: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const updatedItem = { ...draggedItem, user_rating: rating };
    const updatedItems = [...ratings];
    let updatedIndex: number;

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
        const lastItem = ratedItems[ratedItems.length - 1];
        updatedIndex =
          updatedItems.findIndex((item) => item.item_id === lastItem.item_id) +
          1;
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
        // Add to an empty watchlist
        updatedIndex = 0;
      }
    }
    console.log('updatedIndex:', updatedIndex);

    // Insert the dragged item into its new position
    updatedItems.splice(updatedIndex, 0, updatedItem);

    setDraggedItemIndex(updatedIndex);
    setRatings(updatedItems);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDraggedItemIndex(null);
  };

  return (
    <div>
      {ratingValues.map((rating) => (
        <div
          key={rating ? rating : 'queue'}
          onDragOver={(e) => handleDragOver(e, rating)}
          // onDrop={}
        >
          <div className="flex">
            {rating ? (
              Array.from({ length: rating }, (_, index) => (
                // eslint-disable-next-line react/jsx-key
                <Star key={index} fill="black" strokeWidth={0} />
              ))
            ) : (
              <WatchListHeader ratings={ratings} setRatings={setRatings} />
            )}
          </div>
          <Separator className="my-2" />
          <div className="flex flex-wrap gap-2 pb-5">
            {ratings.map(
              (item, index) =>
                item.user_rating === rating && (
                  <div
                    key={item.item_id}
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
          </div>
        </div>
      ))}
    </div>
  );
}
