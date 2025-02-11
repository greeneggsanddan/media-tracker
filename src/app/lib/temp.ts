const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMTBhOTIzMjIyYjIyZDhlMWY3OGViNjk0MzNlNzIxZCIsIm5iZiI6MTczNzUwODM5MS40MjgsInN1YiI6IjY3OTA0NjI3MzQ3OWM0OGNjYjI4YTI4MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.M4iZWF_Olr3QuYt0b-aljhmYfmg7XQARnjN3n6Sli7I',
  },
};

fetch(url, options)
  .then((res) => res.json())
  .then((json) => console.log(json))
  .catch((err) => console.error(err));
