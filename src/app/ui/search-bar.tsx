'use client'

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { TvShow, TvProps } from '../lib/types';
import { createRating, fetchResults } from '../lib/actions';
import { toast } from 'sonner';

export default function SearchBar({ user, ratings, setRatings }: TvProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [results, setResults] = useState<TvShow[]>([]);
  const [loading, setLoading] = useState(false);

  // Debouncing to limit searching to when the user stops typing
  useEffect(() => {
    const debounce = setTimeout(() => {
      handleSearch(value);
    }, 300);

    return () => clearTimeout(debounce);
  }, [value]);

  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      const response = await fetchResults(query);
      setResults(response);
      setOpen(true);
    } catch (error) {
      console.error('Search Error:', error);
    } finally {
      setLoading(false);
    }
  };

  function convertToRating(item: TvShow, position: number) {
    return {
      user_id: user.id,
      item_id: item.id,
      item_type: 'tv',
      user_rating: null,
      position,
      title: item.name,
      poster_path: item.poster_path,
    };
  }

  const handleSelect = async (item: TvShow) => {
    // Check for existing duplicates
    console.log(item);
    if (ratings.some((rating) => rating.item_id === item.id)) {
      toast('Item already exists');
      return;
    }
    try {
      const updatedRatings = [...ratings];
      const itemsInWatchlist = updatedRatings.filter(
        (i) => i.user_rating === null
      ).length;
      console.log(item);
      const newRating = convertToRating(item, itemsInWatchlist);
      updatedRatings.splice(itemsInWatchlist, 0, newRating);

      // Displays the rating immediately in the UI
      setRatings(updatedRatings);
      setOpen(false);

      // Updates the array with a rating that has an ID from the database
      const ratingWithId = await createRating(newRating);
      const finalRatings = [...updatedRatings];
      finalRatings.splice(itemsInWatchlist, 1, ratingWithId);
      setRatings(updatedRatings);
    } catch (error) {
      console.error('Error creating rating:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setOpen(e.target.value.length > 0);
  };

  return (
    <div className="relative">
      <div className="flex gap-2 relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="What have you been watching?"
          className="pl-8"
          value={value}
          onChange={handleChange}
        />
      </div>
      {open && value.trim().length > 0 && (
        <div className="absolute w-full z-50 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          {loading ? (
            <div>Searching...</div>
          ) : results.length > 0 ? (
            results.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground p-2 rounded-sm"
              >
                {item.name} ({item.first_air_date?.slice(0, 4)})
              </div>
            ))
          ) : (
            <div className="p-2">Show not found.</div>
          )}
        </div>
      )}
    </div>
  );
}
