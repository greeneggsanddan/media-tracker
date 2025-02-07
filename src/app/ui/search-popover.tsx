'use client';

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
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
import { PlusCircle, Plus } from "lucide-react";

export function SearchPopover({ items, setItems }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [data, setData] = useState([]);

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

  // Do I need to find the details of the tv show?
  // const handleSelect = async (id) => {
  //   try {
  //     const options = {
  //       method: 'GET',
  //       headers: {
  //         accept: 'application/json',
  //         Authorization:
  //         `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
  //       },
  //     };
  //     const response = await fetch(
  //       `https://api.themoviedb.org/3/tv/${id}?language=en-US`,
  //       options
  //     )
  //     const result = await response.json();
  //     console.log(result);
  //   } catch (error) {
  //     console.error('Error getting details:', error);
  //   }
  //   setOpen(false);
  // }

  const handleSelect = (item) => {
    const newItem = { ...item, user_rating: null };
    const updatedItems = [...items];
    const itemsInQueue = updatedItems.filter(i => i.user_rating === null).length;
    updatedItems.splice(itemsInQueue, 0, newItem);

    setItems(updatedItems);
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
              {data.map((item) => (
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