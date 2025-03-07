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
import { Rating, HandleDragOverFunction } from '../lib/types';
import { updateRatings, deleteRating } from '../lib/actions';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RatingItemProps {
  item: Rating;
  index: number;
  draggedItemIndex: number | null;
  handleDragOver: HandleDragOverFunction;
  isDraggable: boolean;
  setDraggedItem: React.Dispatch<React.SetStateAction<Rating | null>>;
  setDraggedItemIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setInitialRating: React.Dispatch<React.SetStateAction<number | null>>;
  setDraggedItemRating: React.Dispatch<React.SetStateAction<number | null>>;
  ratings: Rating[];
  setRatings: React.Dispatch<React.SetStateAction<Rating[]>>;
  padding: number;
}

export default function RatingItem({
  item,
  index,
  draggedItemIndex,
  handleDragOver,
  isDraggable,
  setDraggedItem,
  setDraggedItemIndex,
  setInitialRating,
  setDraggedItemRating,
  ratings,
  setRatings,
  padding,
}: RatingItemProps) {
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
        (rating) => rating.user_rating === item.user_rating
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

  const handleUpdate = async () => {};

  const sameRatingsCount = (ratingValue) =>
    ratings.filter((rating) => rating.user_rating === ratingValue).length;

  return (
    <div
      className={`w-1/3 md:w-[144px] p-${padding}`}
      draggable={isDraggable}
      onDragStart={isDraggable ? () => handleDragStart(item, index) : undefined}
      onDragOver={
        isDraggable
          ? (e) => handleDragOver(e, item.user_rating, item, index)
          : undefined
      }
    >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div
            className={`relative w-full aspect-[2/3] drop-shadow ${
              draggedItemIndex === index ? 'opacity-50' : ''
            }`}
          >
            <Image
              src={`https://image.tmdb.org/t/p/w185${item.poster_path}`}
              alt={item.title}
              fill
              className="object-cover rounded-md"
            />
            <div className="absolute inset-0 bg-black rounded-md bg-opacity-0 hover:bg-opacity-10 transition-opacity" />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{item.title}</DialogTitle>
            <DialogDescription>{item.release_year}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative w-full aspect-[2/3] drop-shadow ">
              <Image
                src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                alt={`${item.title} (${item.release_year})`}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex flex-col w-full h-full justify-start gap-4">
              <div className="grid gap-2">
                <Label htmlFor="rating">Rating</Label>
                <Select
                  defaultValue={
                    item.user_rating ? String(item.user_rating) : 'no_rating'
                  }
                >
                  <SelectTrigger id="rating" aria-label="Rating">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no_rating">No rating</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="postion">Position</Label>
                <Select defaultValue={String(item.position + 1)}>
                  <SelectTrigger id="position" aria-label="Position">
                    <SelectValue placeholder={item.position + 1} />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      { length: sameRatingsCount(item.user_rating) },
                      (_, index) => (
                        <SelectItem key={index} value={String(index + 1)}>
                          {index + 1}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-between">
            <Button
              variant="destructive"
              className="justify-self-start"
              onClick={() => handleDelete(item, index)}
            >
              Delete
            </Button>
            <Button>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
