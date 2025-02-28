export interface Item {
  adult?: boolean;
  backdrop_path?: string;
  genre_ids?: number[];
  id: number;
  original_language?: string;
  overview?: string;
  popularity?: number;
  poster_path?: string;
  vote_average?: number;
  vote_count?: number;
}

export interface Movie extends Item {
  item_type?: 'movie';
  original_title?: string;
  release_date?: string;
  title: string;
  video?: boolean;
}

export interface TvShow extends Item {
  item_type?: 'tv';
  origin_country?: string[];
  original_name?: string;
  first_air_date?: string;
  name: string;
}

export interface Rating {
  id?: string;
  user_id: string;
  item_id: number;
  item_type: string;
  user_rating: number | null;
  position: number | null;
  // Basic info
  title: string;
  poster_path?: string | null;
  release_year?: number | null;
}

export interface HandleDragOverFunction {
  (
    e: React.DragEvent<HTMLDivElement>,
    rating?: number | null,
    targetItem?: Rating,
    index?: number
  ): void;
}
