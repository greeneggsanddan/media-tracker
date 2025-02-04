import Image from "next/image";

export default function RatingLists({ items, setItems }) {
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const ratings = [5, 4, 3, 2, 1];
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  const handleDragOver = e => {
    e.preventDefault();
  };

  const handleDrop = (e, targetRating, targetItem?) => {
    e.preventDefault();
    const draggedItem = JSON.parse(e.dataTransfer.getData('text/plain'));

    let updatedItems = [...items];

    // Remove the dragged item from its current position
    updatedItems = updatedItems.filter(
      (item) => item.id !== draggedItem.id
    );

    if (targetItem) {
      // Reordering within the same rating or inserting at specific position
      const targetIndex = updatedItems.findIndex(
        (item) => item.id === targetItem.id
      );
      updatedItems.splice(targetIndex, 0, {
        ...draggedItem,
        user_rating: targetRating,
      });
    } else {
      // Dropping into an empty rating category
      updatedItems.push({ ...draggedItem, user_rating: targetRating });
    }

    // Update order numbers
    updatedItems = updatedItems.map((item, index) => ({
      ...item,
      order: index,
    }));

    setItems(updatedItems);
    // onUpdate?.(updatedItems);
  };

  const itemsByRating = (rating: number) => items.filter(item => item.user_rating === rating);

  return (
    <div>
      {ratings.map((rating) => (
        <div
          key={rating}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, rating)}
        >
          <h2>{rating} stars</h2>
          <div className="flex flex-wrap">
            {itemsByRating(rating)?.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, rating, item)}
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w154${item.poster_path}`}
                  alt="lorem ipsum"
                  width={120}
                  height={120}
                />
              </div>
            ))}
            {(!itemsByRating(rating) || itemsByRating(rating).length === 0) && (
              <div
                className="p-3 border-2 border-dashed border-gray-200 rounded text-gray-400 text-center"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, rating)}
              >
                Drop items here
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
  
  // const thumbnails = items.map((item) => (
  //   <div key={item.id}>
  //     <Image
  //       src={`https://image.tmdb.org/t/p/w154${item.poster_path}`}
  //       alt="lorem ipsum"
  //       width={120}
  //       height={120}
  //     />
  //   </div>
  // ));

  // return (
  //   <div>
  //     <h3>{tierName}</h3>
  //     <hr className="border-zinc" />
  //     <div className="flex flex-wrap">{thumbnails}</div>
  //   </div>
  // );
}