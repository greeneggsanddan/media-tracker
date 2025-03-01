'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Rating } from '../lib/types';
import LogOutButton from './logout-button';
import RatingLists from './rating-lists';
import SearchPopover from './search-popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchRatings, fetchTrending } from '../lib/data';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  AlignStartVertical,
  LayoutGrid,
  StretchHorizontal,
} from 'lucide-react';

export default function HomeUI({ user }: { user: User }) {
  const [mediaType, setMediaType] = useState<string>('movie');
  const [movieRatings, setMovieRatings] = useState<Rating[]>([]);
  const [tvRatings, setTvRatings] = useState<Rating[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Partial<Rating>[]>([]);
  const [trendingTv, setTrendingTv] = useState<Partial<Rating>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<string>('tier');
  const handleTabChange = (value: string) => setMediaType(value);
  const handleViewChange = (value: string) => setView(value);

  // Load data from the database
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const movieRatings = await fetchRatings(user.id, 'movie');
        const tvRatings = await fetchRatings(user.id, 'tv');
        if (mounted) {
          setMovieRatings(sortRatings(movieRatings));
          setTvRatings(sortRatings(tvRatings));
        }
      } catch (error) {
        console.error('Error loading ratings:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch trending movies and tv shows
  useEffect(() => {
    let mounted = true;

    async function loadTrending() {
      try {
        const movieData = await fetchTrending('movie');
        const tvData = await fetchTrending('tv');
        if (mounted) {
          setTrendingMovies(movieData);
          setTrendingTv(tvData);
        }
      } catch (error) {
        console.error('Error fetching trending items:', error);
      }
    }

    loadTrending();
    return () => {
      mounted = false;
    };
  }, []);

  function sortRatings(array: Rating[]) {
    if (!array || array.length === 0) return [];

    return array.sort((a, b) => {
      if (a.user_rating === null && b.user_rating === null) {
        return a.position - b.position;
      }
      if (a.user_rating === null) return -1;
      if (b.user_rating === null) return 1;

      if (a.user_rating !== b.user_rating) {
        return b.user_rating - a.user_rating;
      }

      return a.position - b.position;
    });
  }

  return (
    <>
      <header className="mx-auto flex justify-between items-center px-4 py-2 border-b">
        <h1 className="text-3xl font-bold tracking-tight">Media Tracker</h1>
        <LogOutButton />
      </header>
      <div className="mx-auto md:max-w-[1074px] md:border-x min-h-screen">
        <div className="px-2 py-2 md:px-8">
          <Tabs
            defaultValue={mediaType}
            onValueChange={(value) => handleTabChange(value)}
            className="flex flex-col"
          >
            <div className="flex justify-between">
              <div className="w-[76px] hidden md:block"></div>
              <TabsList className="">
                <TabsTrigger value="movie">Movies</TabsTrigger>
                <TabsTrigger value="tv">TV Shows</TabsTrigger>
              </TabsList>
              <ToggleGroup
                type="single"
                defaultValue="tier"
                onValueChange={(value) => handleViewChange(value)}
              >
                <ToggleGroupItem value="tier">
                  <AlignStartVertical />
                </ToggleGroupItem>
                <ToggleGroupItem value="grid">
                  <LayoutGrid />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <TabsContent value="movie">
              <SearchPopover
                user={user}
                ratings={movieRatings}
                setRatings={setMovieRatings}
                mediaType={mediaType}
                trending={trendingMovies}
              />
              <RatingLists
                ratings={movieRatings}
                setRatings={setMovieRatings}
                view={view}
              />
            </TabsContent>
            <TabsContent value="tv">
              <SearchPopover
                user={user}
                ratings={tvRatings}
                setRatings={setTvRatings}
                mediaType={mediaType}
                trending={trendingTv}
              />
              <RatingLists
                ratings={tvRatings}
                setRatings={setTvRatings}
                view={view}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
