import { movieActions } from "./redux-store";
import { db } from "../firebase/firebaseConfig";
import emailjs from "@emailjs/browser";
import {
  collection,
  getDoc,
  addDoc,
  getDocs,
  doc,
  where,
  query,
  Timestamp,
} from "firebase/firestore";

// Function to add a category to the Firestore database
export const addCategoryToDatabase = (category) => {
  return async (dispatch) => {
    // Step 1: Normalize the category to uppercase
    const normalizedCategory = category.trim().toUpperCase();

    try {
      // Step 2: Query the Firestore collection for the category name
      const categoryRef = collection(db, "categories");
      const categoryQuery = query(
        categoryRef,
        where("name", "==", normalizedCategory)
      );

      // Step 3: Execute the query
      const querySnapshot = await getDocs(categoryQuery);

      if (querySnapshot.empty) {
        // Step 4: Add the category if it doesn't exist
        const docRef = await addDoc(categoryRef, { name: normalizedCategory });
        dispatch(movieActions.setselectedCategoryId(docRef.id));
        console.log("Category added with ID:", docRef.id);
      } else {
        const existingCategoryId = querySnapshot.docs[0].id;
        dispatch(movieActions.setselectedCategoryId(existingCategoryId));
        console.log("Category already exists. No action taken.");
      }

      // Step 5: Dispatch the category to the state (optional)
      dispatch(movieActions.setSelectedCategory(normalizedCategory));
    } catch (e) {
      console.error("Error adding category:", e.message);
    }
  };
};
// Function to add a movie to the Firestore database
export const addMovieToDatabase = (movieData) => {
  return async (dispatch) => {
    const { category, ...movieDetails } = movieData;
    console.log("sec:", category);

    try {
      console.log("Movie Data:", movieData); // Log the input data

      // Reference the 'categories' collection
      const categoryRef = collection(db, "categories");
      console.log("Category Reference:", categoryRef); // Log the reference

      // Query for the specific category
      const categoryQuery = query(categoryRef, where("name", "==", category));
      console.log("Category Query:", categoryQuery); // Log the query object

      // Execute the query
      const querySnapshot = await getDocs(categoryQuery);
      console.log("Query Snapshot:", querySnapshot); // Log the query snapshot

      // Check if the category exists
      if (querySnapshot.empty) {
        console.error("Category does not exist!");
        return;
      }

      // Get the first (and only) matching category document
      const categoryDoc = querySnapshot.docs[0];
      console.log(
        "Category Document:",
        categoryDoc.data(),
        "ID:",
        categoryDoc.id
      );

      // Create a reference to the 'movies' sub-collection under the category
      const movieCollectionRef = collection(
        db,
        "categories",
        categoryDoc.id,
        "movies"
      );
      console.log("Movies Sub-collection Reference:", movieCollectionRef);

      // Add the movie to the 'movies' sub-collection
      const movieDocRef = await addDoc(movieCollectionRef, movieDetails);
      console.log("Movie added to category with ID:", movieDocRef.id);

      // Dispatch the action to add the movie to the Redux store
      dispatch(movieActions.addMovie(movieData));
    } catch (e) {
      console.error("Error adding movie to database:", e);

      // Log more details if possible
      if (e.code) {
        console.error("Error Code:", e.code); // Firebase error code
      }
      if (e.message) {
        console.error("Error Message:", e.message); // Error message
      }
    }
  };
};
// Function to add a showtime to the Firestore database

export const addShowtimeToDatabase = (showDetails) => {
  return async (dispatch) => {
    try {
      const { movieId, showDate, showTime, categoryId } = showDetails;

      // Validate required fields
      if (!movieId) throw new Error("Movie ID is required to add a showtime");
      if (!categoryId)
        throw new Error("Category is not selected, please select it");

      // Combine date and time into a single string
      const combinedDatetime = `${showDate}T${showTime}`;

      // Firestore reference
      const movieShowtimesRef = collection(
        db,
        `categories/${categoryId}/movies/${movieId}/showtimes`
      );

      // Add the showtime to Firestore
      const docRef = await addDoc(movieShowtimesRef, {
        showtimeString: combinedDatetime,
      });

      alert("Showtime added successfully");
    } catch (e) {
      console.error("Error adding showtime:", e.message);
    }
  };
};

// Function to get all booked movies from the Firestore database
export const getBookedMovies = () => {
  return async (dispatch) => {
    const fetchBookedMovies = async () => {
      try {
        const snapshot = await getDocs(collection(db, "bookedMovies"));
        const bookedMovies = snapshot.docs.map((doc) => doc.data());
        console.log("Booked Movies:", bookedMovies);
        return bookedMovies;
      } catch (e) {
        console.error("Error fetching booked movies: ", e);
      }
    };

    try {
      return await fetchBookedMovies();
    } catch (e) {
      console.log("Error in get booked movies function: ", e.message);
    }
  };
};
//Function to get all movie details from the firestore database

export const fetchMovieDetails = (categoryId, movieId) => {
  return async (dispatch) => {
    dispatch(movieActions.setLoading(true));
    try {
      // Fetch the movie details
      const movieRef = doc(db, `categories/${categoryId}/movies/${movieId}`);
      const movieDoc = await getDoc(movieRef);

      if (!movieDoc.exists()) {
        throw new Error("Movie not found");
      }

      const movieDetails = movieDoc.data();

      // Fetch the showtimes
      const movieShowtimesRef = collection(
        db,
        `categories/${categoryId}/movies/${movieId}/showtimes`
      );
      const querySnapshot = await getDocs(movieShowtimesRef);

      const showtimes = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          showtimeString: data.showtimeString, // Store as string
        };
      });

      // Combine movie details and showtimes
      const fullMovieDetails = {
        ...movieDetails,
        showtimes,
      };

      console.log(fullMovieDetails);

      // Dispatch the action to set movie details
      dispatch(movieActions.setMovieDetails(fullMovieDetails));
      dispatch(movieActions.setLoading(false));
    } catch (e) {
      console.error("Error fetching movie details and showtimes:", e.message);
    }
  };
};

export const saveBookingToDB = (bookingData) => {
  return async (dispatch) => {
    console.log(bookingData);
    const saveBooking = async () => {
      try {
        const docRef = await addDoc(
          collection(db, "bookedMovies"),
          bookingData
        );
        console.log("Document successfully written with ID: ", docRef.id);
        return { id: docRef.id, ...bookingData };
      } catch (error) {
        console.error("Error adding booking to Firestore: ", error);
        throw error; // Re-throw error for outer catch
      }
    };

    try {
      const savedBooking = await saveBooking();

      // Optionally dispatch an action if you need to update Redux state
      dispatch(movieActions.setBookedMovies(savedBooking));

      return savedBooking; // Return the saved booking for further use
    } catch (error) {
      console.error("Error in saveBookingToDB function: ", error.message);
    }
  };
};


