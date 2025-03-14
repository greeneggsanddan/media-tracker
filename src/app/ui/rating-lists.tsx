'use client';

import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Star } from 'lucide-react';
import { Rating, HandleDragOverFunction } from '@/app/lib/types';
import { updateRatings } from '../lib/actions';
import RatingItem from './rating-item';

interface RatingListsProps {
  ratings: Rating[];
  setRatings: React.Dispatch<React.SetStateAction<Rating[]>>;
  view: string;
}

export default function RatingLists({
  ratings,
  setRatings,
  view,
}: RatingListsProps) {
  const [draggedItem, setDraggedItem] = useState<Rating | null>(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [initialRating, setInitialRating] = useState<number | null>(null);
  const [draggedItemRating, setDraggedItemRating] = useState<number | null>(
    null
  );
  const ratingValues = [null, 5, 4, 3, 2, 1];

  const handleDragOver: HandleDragOverFunction = (
    e,
    rating,
    targetItem,
    index
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedItemIndex === null || draggedItemIndex === index) return;

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

    // Update the dragged item and insert it into its new position
    const updatedItem = { ...draggedItem, user_rating: rating };
    updatedItems.splice(updatedIndex, 0, updatedItem);

    setDraggedItem(updatedItem);
    setDraggedItemIndex(updatedIndex);
    setDraggedItemRating(rating);
    setRatings(updatedItems);
  };

  async function updatePositions() {
    try {
      const initialRatings = ratings.filter(
        (item) => item.user_rating === initialRating
      );
      const finalRatings = ratings.filter(
        (item) => item.user_rating === draggedItemRating
      );
      const updatedInitialRatings = initialRatings.map((item, index) => ({
        ...item,
        position: index,
      }));
      const updatedFinalRatings = finalRatings.map((item, index) => ({
        ...item,
        position: index,
      }));

      if (initialRating !== draggedItemRating) {
        await Promise.all([
          updateRatings(updatedInitialRatings),
          updateRatings(updatedFinalRatings),
        ]);
      } else {
        await updateRatings(updatedFinalRatings);
      }
    } catch (error) {
      console.error('Error updating positions:', error);
    }
  }

  const handleDrop = async () => {
    try {
      setDraggedItem(null);
      setDraggedItemIndex(null);
      setInitialRating(null);
      setDraggedItemRating(null);
      await updatePositions();
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const allItems = (array: Rating[]) => {
    return array.map((item, index) => (
      <div className="w-1/3 md:w-[144px] mb-2" key={item.item_id}>
        <RatingItem
          item={item}
          index={index}
          draggedItemIndex={draggedItemIndex}
          handleDragOver={handleDragOver}
          isDraggable={false}
          setDraggedItem={setDraggedItem}
          setDraggedItemIndex={setDraggedItemIndex}
          setInitialRating={setInitialRating}
          setDraggedItemRating={setDraggedItemRating}
          ratings={ratings}
          setRatings={setRatings}
          padding={1}
        />
        <div className="flex ms-1">
          {Array.from({ length: item.user_rating }, (_, index) => (
            <Star
              key={index}
              fill="black"
              strokeWidth={0}
              className="w-3.5 h-3.5 md:w-4 md:h-4"
            />
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div onDrop={handleDrop}>
      {view === 'grid' ? (
        <div className="flex flex-wrap pb-4 mt-4">{allItems(ratings)}</div>
      ) : (
        ratingValues.map((ratingValue) => (
          <div
            key={ratingValue ? ratingValue : 'watchlist'}
            onDragOver={(e) => handleDragOver(e, ratingValue)}
          >
            <div className="flex">
              {ratingValue ? (
                Array.from({ length: ratingValue }, (_, index) => (
                  <Star
                    key={index}
                    fill="black"
                    strokeWidth={0}
                    className="w-5 h-5"
                  />
                ))
              ) : (
                <h2 className="text-2xl font-semibold tracking-tight -mb-1 mt-4">
                  Watchlist
                </h2>
              )}
            </div>
            <Separator className="my-1" />
            <div className="flex flex-wrap pb-4">
              {ratings.map(
                (item, index) =>
                  item.user_rating === ratingValue && (
                    <div className="w-1/3 md:w-[144px]" key={item.item_id}>
                      <RatingItem
                        item={item}
                        index={index}
                        draggedItemIndex={draggedItemIndex}
                        handleDragOver={handleDragOver}
                        isDraggable={true}
                        setDraggedItem={setDraggedItem}
                        setDraggedItemIndex={setDraggedItemIndex}
                        setInitialRating={setInitialRating}
                        setDraggedItemRating={setDraggedItemRating}
                        ratings={ratings}
                        setRatings={setRatings}
                        padding={1}
                      />
                    </div>
                  )
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
