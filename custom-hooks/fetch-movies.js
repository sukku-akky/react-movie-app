import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"
import { movieActions } from "../store/redux-store"

const useFetchCategoriesWithMovies = () => {
    const dispatch = useDispatch();
    console.log("useFetchCategoriesWithMovies: Hook invoked");
    useEffect(() => {
      const fetchCategoriesWithMovies = async () => {
        // Start by setting loading to true
        dispatch(movieActions.setLoading(true));
        console.log("fetching")
  
        try {
          const categoriesRef = collection(db, "categories");
          const categoriesSnapshot = await getDocs(categoriesRef);
  
          const categoriesWithMovies = [];
          
          // Fetch movies sequentially
          for (const categoryDoc of categoriesSnapshot.docs) {
            const categoryData = categoryDoc.data();
            const moviesRef = collection(db, `categories/${categoryDoc.id}/movies`);
            const moviesSnapshot = await getDocs(moviesRef);
  
            const movies = moviesSnapshot.docs.map((movieDoc) => ({
              id: movieDoc.id,
              ...movieDoc.data(),
            }));
  
            categoriesWithMovies.push({
              id: categoryDoc.id,
              ...categoryData,
              movies,
            });
          }
  
          // Dispatch the fetched data to Redux store
          dispatch(movieActions.setCategorizedMovies(categoriesWithMovies));
        } catch (error) {
          console.error("Error fetching categories with movies:", error);
          dispatch(movieActions.setError(error.message)); // Optionally set error message
        } finally {
          dispatch(movieActions.setLoading(false)); // Set loading to false
        }
      };
  
      fetchCategoriesWithMovies();
    }, [dispatch]);
  };
export default useFetchCategoriesWithMovies;


