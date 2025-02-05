import Image from 'next/image';
import { useState } from 'react';

export default function RatingLists({ items, setItems }) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const ratings = [5, 4, 3, 2, 1];

  const handleDragStart = (item, index) => {
    setDraggedItem(item);
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e, rating, targetItem?, index?) => {
    e.preventDefault();

    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const updatedItem = { ...draggedItem, user_rating: rating };
    let updatedItems = [...items];
    let updatedIndex;

    if (targetItem) {
      // Insert at specific position
      updatedIndex = index;
    } else {
      // Add to end of rating group
      const ratedItems = updatedItems.filter(
        (item) => item.user_rating === rating
      );
      if (ratedItems.length > 0) {
        // You need to add an invisible target
        const lastItem = ratedItems[ratedItems.length - 1];
        updatedIndex =
          updatedItems.findIndex((item) => item.id === lastItem.id) + 1;
      } else {
        // Add to empty rating group (Change when adding a queue group)
        updatedIndex = updatedItems.filter(
          (item) => item.user_rating > rating
        ).length;
      }
    }

    // Remove the dragged item from its current position and insert it into its new position
    updatedItems.splice(draggedItemIndex, 1);
    updatedItems.splice(updatedIndex, 0, updatedItem);

    setDraggedItemIndex(updatedIndex);
    setItems(updatedItems);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDraggedItemIndex(null);
  }

  return (
    <div>
      {ratings.map((rating) => (
        <div
          key={rating}
          // onDragOver={(e) => handleDragOver(e, rating)}
          // onDrop={}
        >
          <h2>{rating} stars</h2>
          <div className="flex flex-wrap">
            {items.map(
              (item, index) =>
                item.user_rating === rating && (
                  <div
                    key={item.id}
                    className={`relative transition-transform ${
                      draggedItemIndex === index ? 'opacity-50 scale-105' : ''
                    }`}
                    draggable
                    onDragStart={() => handleDragStart(item, index)}
                    onDragOver={(e) => handleDragOver(e, rating, item, index)}
                    // onDrop={}
                    onDragEnd={handleDragEnd}
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w154${item.poster_path}`}
                      alt="lorem ipsum"
                      width={120}
                      height={120}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity" />
                  </div>
                )
            )}
            {(!items ||
              items.filter((item) => item.user_rating === rating).length ===
                0) && (
              <div
                className="p-3 border-2 border-dashed border-gray-200 rounded text-gray-400 text-center"
                onDragOver={(e) => handleDragOver(e, rating)}
                // onDrop={}
              >
                Drop items here
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
