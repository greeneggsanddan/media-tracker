'use client';
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {  Plus } from "lucide-react";
import { TvProps, TvShow } from "@/app/lib/types";
import { v4 as uuidv4 } from 'uuid';

export function SearchPopover({ ratings, setRatings }: TvProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [data, setData] = useState<TvShow[]>([]);

  // Debouncing to limit searching to when the user stops typing
  useEffect(() => {
    const debounce = setTimeout(() => {
      handleSearch(value);
    }, 300);

    return () => clearTimeout(debounce);
  }, [value]);

  const handleSearch = async (query: string) => {
    try {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization:
          `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
        },
      };
      const response = await fetch(
        `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`,
        options
      );
      const result = await response.json();

      setData(result.results.slice(0, 5));
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  }

  function convertToRating(item: TvShow) {
    return {
      id: uuidv4(),
      user_id: '410544b2-4001-4271-9855-fec4b6a6442a',
      item_id: item.id,
      item_type: 'tv',
      user_rating: null,
      position: null,
      title: item.name,
      poster_path: item.poster_path,
    };
  }

  const handleSelect = (item: TvShow) => {
    const newRating = convertToRating(item);
    const updatedRatings = [...ratings];
    const itemsInWatchlist = updatedRatings.filter(i => i.user_rating === null).length;
    updatedRatings.splice(itemsInWatchlist, 0, newRating);

    setRatings(updatedRatings);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
        >
          <Plus color="white" strokeWidth={3}/>
          <span>Add to watchlist</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="end">
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
              {data.map((item: TvShow) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={() => handleSelect(item)}
                >
                  {item.name}
                </CommandItem>
              ))}
              {/* {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {framework.label}
                </CommandItem>
              ))} */}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}