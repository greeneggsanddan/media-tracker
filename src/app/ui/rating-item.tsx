'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Rating } from '../lib/types';
import { updateRatings, deleteRating } from '../lib/actions';
import { useState } from 'react';

export default function RatingItem({
  item,
  index,
  ratingValue,
  draggedItemIndex,
  handleDragOver,
  setDraggedItem,
  setDraggedItemIndex,
  setInitialRating,
  setDraggedItemRating,
  ratings,
  setRatings,
}) {
  const [open, setOpen] = useState<boolean>(false);

  const handleDragStart = (item: Rating, index: number) => {
    setDraggedItem(item);
    setDraggedItemIndex(index);
    setInitialRating(item.user_rating);
    setDraggedItemRating(item.user_rating);
  };

  const handleDelete = async (item: Rating, index: number) => {
    try {
      const updatedRatings = [...ratings];
      updatedRatings.splice(index, 1);
      setRatings(updatedRatings);
      setOpen(false);
      await deleteRating(item.id);

      const sameRatings = updatedRatings.filter(
        (rating) => rating.user_rating === ratingValue
      );
      const updatedPositions = sameRatings.map((item, index) => ({
        ...item,
        position: index,
      }));
      await updateRatings(updatedPositions);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div
          className={`h-[216px] w-[144px] p-1 transition-transform drop-shadow ${
            draggedItemIndex === index ? 'opacity-50' : ''
          }`}
          draggable
          onDragStart={() => handleDragStart(item, index)}
          onDragOver={(e) => handleDragOver(e, ratingValue, item, index)}
        >
          <div className='relative w-full h-full'>
            <Image
              src={`https://image.tmdb.org/t/p/w185${item.poster_path}`}
              alt={item.name}
              fill
              className="object-cover rounded-md"
            />
            <div className="absolute inset-0 bg-black rounded-md bg-opacity-0 hover:bg-opacity-10 transition-opacity" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Item name</DialogTitle>
          <DialogDescription>Lorem Ipsum</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          <Button
            variant="destructive"
            onClick={() => handleDelete(item, index)}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
