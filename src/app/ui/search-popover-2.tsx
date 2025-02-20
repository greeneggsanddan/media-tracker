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
import { Plus, Search } from 'lucide-react';
import { Rating, TvShow, TvProps } from '@/app/lib/types';
import { createRating, fetchResults } from '../lib/actions';
import { toast } from 'sonner';

export default function SearchPopover2({ user, ratings, setRatings }: TvProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [results, setResults] = useState<TvShow[]>([]);

  // Debouncing to limit searching to when the user stops typing
  useEffect(() => {
    const debounce = setTimeout(() => {
      handleSearch(value);
    }, 300);

    return () => clearTimeout(debounce);
  }, [value]);

  const handleSearch = async (query: string) => {
    try {
      const response = await fetchResults(query);
      console.log(response);
      setResults(response);
    } catch (error) {
      console.error('Search Error:', error);
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
      setValue('');
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
      <PopoverContent className="p-0 w-[880px]">
        <Command>
          <CommandInput
            placeholder="Search for show..."
            className="h-9"
            value={value}
            onValueChange={setValue}
          />
          <CommandList>
            <CommandEmpty>Show not found.</CommandEmpty>
            <CommandGroup>
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
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
