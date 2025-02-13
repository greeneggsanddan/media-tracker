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
  setRatings
}) {
  const handleDragStart = (item: Rating, index: number) => {
    setDraggedItem(item);
    setDraggedItemIndex(index);
    setInitialRating(item.user_rating);
    setDraggedItemRating(item.user_rating);
    console.log('draggedItem:', item);
    console.log('draggedItemIndex:', index);
  };

  const handleDelete = async (item: Rating, index: number) => {
    try {
      await deleteRating(item.id);

      const updatedRatings = [...ratings];
      updatedRatings.splice(index, 1);
      setRatings(updatedRatings);
      
      const sameRatings = updatedRatings.filter((rating) => rating.user_rating === ratingValue);
      const updatedPositions = sameRatings.map((item, index) => ({...item, position: index}));
      await updateRatings(updatedPositions);
      console.log('Item deleted', item);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div
          key={item.item_id}
          className={`h-[180px] w-[120px] relative transition-transform drop-shadow ${
            draggedItemIndex === index ? 'opacity-50 scale-105' : ''
          }`}
          draggable
          onDragStart={() => handleDragStart(item, index)}
          onDragOver={(e) => handleDragOver(e, ratingValue, item, index)}
        >
          <Image
            src={`https://image.tmdb.org/t/p/w154${item.poster_path}`}
            alt="lorem ipsum"
            fill
            className="rounded-md object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Item name</DialogTitle>
          <DialogDescription>Lorem Ipsum</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          <Button variant="destructive" onClick={() => handleDelete(item, index)}>Delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
