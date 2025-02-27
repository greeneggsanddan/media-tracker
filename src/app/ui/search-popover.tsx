'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Search } from 'lucide-react';
import { Rating, TvShow } from '@/app/lib/types';
import { createRating } from '../lib/actions';
import { fetchResults } from '../lib/data';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

interface SearchPopoverProps {
  user: User;
  ratings: Rating[];
  setRatings: React.Dispatch<React.SetStateAction<Rating[]>>;
  mediaType: string;
  trending: Partial<Rating>[];
}

export default function SearchPopover({ user, ratings, setRatings, mediaType, trending }: SearchPopoverProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [results, setResults] = useState<Partial<Rating>[]>([]);
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
      const response = await fetchResults(query, mediaType);
      if (response.length > 0) {
        setResults(response);
      } else {
        // Set something to display when results are empty
      }
    } catch (error) {
      console.error('Search Error:', error);
    } finally {
      setLoading(false);
    }
  };

  function convertToRating(item: Partial<Rating>, position: number) {
    return {
      user_id: user.id,
      item_id: item.item_id,
      item_type: item.item_type,
      user_rating: null,
      position,
      title: item.title,
      poster_path: item.poster_path,
      release_year: item.release_year,
    };
  }

  const handleSelect = async (item: Partial<Rating>) => {
    // Check for existing duplicates
    if (ratings.some((rating) => rating.item_id === item.item_id)) {
      toast('You have already added this item.');
      setValue('');
      setResults([]);
      setOpen(false);
      return;
    }
    try {
      const updatedRatings = [...ratings];
      const itemsInWatchlist = updatedRatings.filter(
        (i) => i.user_rating === null
      ).length;
      const newRating = convertToRating(item, itemsInWatchlist);
      updatedRatings.splice(itemsInWatchlist, 0, newRating);

      // Displays the rating immediately in the UI
      setRatings(updatedRatings);
      setValue('');
      setResults([]);
      setOpen(false);

      // Updates the array with a rating that has an ID from the database
      const ratingWithId = await createRating(newRating);
      const finalRatings = [...updatedRatings];
      finalRatings.splice(itemsInWatchlist, 1, ratingWithId);
      setRatings(finalRatings);
    } catch (error) {
      console.error('Error creating rating:', error);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          variant="outline"
          className="p-2.5 w-full justify-start"
          aria-expanded={open}
        >
          <Search className="opacity-50" strokeWidth={2} />
          <span className="text-muted-foreground">
            What have you been watching?
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[calc(100vw-1rem)] md:w-[calc(1074px-4rem)]">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Search for a ${mediaType === 'movie' ? 'movie' : 'tv show'}...`}
            className="h-9"
            value={value}
            onValueChange={setValue}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {results.length > 0 ? (
              <CommandGroup heading="Search results">
                {results.map((item: Partial<Rating>) => (
                  <CommandItem
                    key={item.item_id}
                    value={`${item.title} (${item.id})`}
                    onSelect={() => handleSelect(item)}
                  >
                    {item.title} ({item.release_year})
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandGroup heading="Trending">
                {trending.map((item: Partial<Rating>) => (
                  <CommandItem
                    key={item.item_id}
                    value={`${item.title} (${item.id})`}
                    onSelect={() => handleSelect(item)}
                  >
                    {item.title} ({item.release_year})
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
