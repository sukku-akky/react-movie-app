import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialMovieState = {
  categorizedMovies: [],
  selectedCategory: null,
  selectedCategoryId: null,
  selectedMovieId: null,
  error: null,
  adminLogStatus: JSON.parse(localStorage.getItem("adminLogStatus")) || false,
  categories: [],
  loading: null,
  bookedMovies: [],
  selectedMovie: null,
};

const movieSlice = createSlice({
  name: "movie",
  initialState: initialMovieState,
  reducers: {
    setSelectedCategory(state, action) {
      const category = action.payload.toUpperCase();
      state.selectedCategory = category;
    },
    setMovieDetails(state, action) {
      const movie = action.payload;

      // Transform showtimes array
      const serializedShowtimes = movie.showtimes.map((showtime) => ({
        ...showtime,
        showtimeTimestamp: new Date(showtime.showtimeString), // Convert to JavaScript Date object
      }));

      // Update the selectedMovie in the state
      state.selectedMovie = {
        ...movie,
        showtimes: serializedShowtimes, // Replace showtimes with serialized version
      };
    },
    clearSelectedMovie(state) {
      state.selectedMovie = null; // Clear movie
    },

    adminLogin(state) {
      state.adminLogStatus = true;
      localStorage.setItem("adminLogStatus", JSON.stringify(true));
    },
    adminLogout(state) {
      state.adminLogStatus = false;
      localStorage.setItem("adminLogStatus", JSON.stringify(false));
    },
    setSelectedMovieId(state, action) {
      state.selectedMovieId = action.payload;
    },
    setSelectedCategoryId(state, action) {
      state.selectedCategoryId = action.payload;
    },

    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    addMovie(state, action) {
      console.log("Payload received:", action.payload);

      const { category, ...movieDetails } = action.payload;

      if (!category) {
        console.error("No category selected");
        return;
      }

      if (!state.categorizedMovies[category]) {
        state.categorizedMovies[category] = [];
      }

      state.categorizedMovies[category].push(movieDetails);
    },

    setBookedMovies(state, action) {
      state.bookedMovies.push(action.payload);
    },
    setCategorizedMovies(state, action) {
      state.categorizedMovies = action.payload;
    },
  },
});

const store = configureStore({
  reducer: {
    movie: movieSlice.reducer,
  },
});

export default store;
export const movieActions = movieSlice.actions;
