function debounce(func, waitFor) {
  let tim;
}

async function getPopularMovies() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMTBhOTIzMjIyYjIyZDhlMWY3OGViNjk0MzNlNzIxZCIsIm5iZiI6MTczNzUwODM5MS40MjgsInN1YiI6IjY3OTA0NjI3MzQ3OWM0OGNjYjI4YTI4MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.M4iZWF_Olr3QuYt0b-aljhmYfmg7XQARnjN3n6Sli7I',
    },
  };
  let popularMovies = [];

  for (let i = 1; i < 51; i++) {
    const fetchTitles = async () => {
      await new Promise((resolve) => setTimeout(resolve, 20)); // Rate limiter

      const response = await fetch(
        `https://api.themoviedb.org/3/tv/popular?language=en-US&page=${i}`,
        options
      );
      if (response.ok) {
        const json = await response.json();
        const { results } = json;
        const titles = results.map((item) => item.name);

        return titles;
      } else {
        throw new Error('Fetch failed');
      }
    };

    const titles = await fetchTitles();
    popularMovies.push(...titles);
  }

  console.log(popularMovies);
}

getPopularMovies();
