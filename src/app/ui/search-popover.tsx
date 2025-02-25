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
import { TvShow, TvProps } from '@/app/lib/types';
import { createRating, fetchResults, fetchTrendingShows } from '../lib/actions';
import { toast } from 'sonner';

export default function SearchPopover({ user, ratings, setRatings }: TvProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [results, setResults] = useState<TvShow[]>([]);
  const [trending, setTrending] = useState<TvShow[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch trending tv shows
  useEffect(() => {
    let mounted = true;

    async function loadTrending() {
      try {
        const response = await fetchTrendingShows();
        if (mounted) setTrending(response);
      } catch (error) {
        console.error('Error fetching trending shows:', error);
      }
    }

    loadTrending();
    return () => {
      mounted = false;
    };
  }, []);

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

  function convertToRating(item: TvShow, position: number) {
    return {
      user_id: user.id,
      item_id: item.id,
      item_type: 'tv',
      user_rating: null,
      position,
      title: item.name,
      poster_path: item.poster_path,
      // release_year: item.first_air_date.slice(0, 4),
    };
  }

  const handleSelect = async (item: TvShow) => {
    // Check for existing duplicates
    if (ratings.some((rating) => rating.item_id === item.id)) {
      toast('Item already exists');
      return;
    }
    try {
      const updatedRatings = [...ratings];
      const itemsInWatchlist = updatedRatings.filter(
        (i) => i.user_rating === null
      ).length;
      const newRating = convertToRating(item, itemsInWatchlist);
      console.log(newRating);
      updatedRatings.splice(itemsInWatchlist, 0, newRating);
      console.log(updatedRatings);

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
      <PopoverContent
        className="p-0 w-[calc(100vw-2rem)] md:w-[864px]"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search for a show..."
            className="h-9"
            value={value}
            onValueChange={setValue}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {results.length > 0 ? (
              <CommandGroup heading="Search results">
                {results.map((item: TvShow) => (
                  <CommandItem
                    key={item.id}
                    value={`${item.name} (${item.id})`}
                    onSelect={() => handleSelect(item)}
                  >
                    {item.name} ({item.first_air_date.slice(0, 4)})
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandGroup heading="Trending">
                {trending.map((item: TvShow) => (
                  <CommandItem
                    key={item.id}
                    value={`${item.name} (${item.id})`}
                    onSelect={() => handleSelect(item)}
                  >
                    {item.name} ({item.first_air_date.slice(0, 4)})
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
