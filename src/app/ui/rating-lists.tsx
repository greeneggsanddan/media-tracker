'use client';

import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { Star } from 'lucide-react';
import { Rating, TvProps } from '@/app/lib/types';
import { fetchRatings } from '@/app/lib/data';
import { updateRatings } from '../lib/actions';
import RatingItem from './rating-item';

export default function RatingLists({ user, ratings, setRatings }: TvProps) {
  const [draggedItem, setDraggedItem] = useState<Rating | null>(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [initialRating, setInitialRating] = useState<number | null>(null);
  const [draggedItemRating, setDraggedItemRating] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const ratingValues = [null, 5, 4, 3, 2, 1];

  // Load data from the database
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const userRatings = await fetchRatings(user.id);
        if (mounted) setRatings(sortRatings(userRatings));
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

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    rating: number | null,
    targetItem?: Rating,
    index?: number
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
    console.log('updatedIndex:', updatedIndex);

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

  function sortRatings(array: Rating[]) {
    if (!array || array.length === 0) return [];

    return array.sort((a, b) => {
      if (a.user_rating === null && b.user_rating === null) {
        return a.position - b.position;
      }
      if (a.user_rating === null) return -1;
      if (b.user_rating === null) return 1;

      if (a.user_rating !== b.user_rating) {
        return b.user_rating - a.user_rating;
      }

      return a.position - b.position;
    });
  }

  return (
    <div onDrop={handleDrop}>
      {ratingValues.map((ratingValue) => (
        <div
          key={ratingValue ? ratingValue : 'watchlist'}
          onDragOver={(e) => handleDragOver(e, ratingValue)}
        >
          <div className="flex">
            {ratingValue ? (
              Array.from({ length: ratingValue }, (_, index) => (
                <Star key={index} fill="black" strokeWidth={0} />
              ))
            ) : (
              <h2 className="text-2xl font-semibold tracking-tight -mb-1 mt-4">
                Watchlist
              </h2>
            )}
          </div>
          <Separator className="my-1" />
          <div className="flex flex-wrap pb-5">
            {ratings.map(
              (item, index) =>
                item.user_rating === ratingValue && (
                  <RatingItem
                    key={item.item_id}
                    item={item}
                    index={index}
                    ratingValue={ratingValue}
                    draggedItemIndex={draggedItemIndex}
                    handleDragOver={handleDragOver}
                    setDraggedItem={setDraggedItem}
                    setDraggedItemIndex={setDraggedItemIndex}
                    setInitialRating={setInitialRating}
                    setDraggedItemRating={setDraggedItemRating}
                    ratings={ratings}
                    setRatings={setRatings}
                  />
                )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
