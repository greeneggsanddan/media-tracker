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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
    <div
      className="w-1/3 md:w-[144px] p-1"
      draggable
      onDragStart={() => handleDragStart(item, index)}
      onDragOver={(e) => handleDragOver(e, ratingValue, item, index)}
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
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative w-full aspect-[2/3]">
              <Image
                src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                alt={item.title}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex flex-col w-full h-full justify-between">
              <div className="grid gap-2">
                <Label htmlFor="rating">Rating</Label>
                <Select>
                  <SelectTrigger id="rating" aria-label="Rating">
                    <SelectValue
                      placeholder={
                        item.user_rating ? item.user_rating : 'No rating'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">No rating</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="1">1</SelectItem>
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
              Stop tracking
            </Button>
            <Button>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
