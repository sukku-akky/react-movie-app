import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { useDispatch ,useSelector} from "react-redux";
import { fetchCategoriesWithMovies } from "../../store/movie-actions";
import { movieActions } from "../../store/redux-store";
import React,{useEffect,useState} from "react";
import useFetchCategoriesWithMovies from "../../custom-hooks/fetch-movies";
const Dashboard = () => {
  
    const categories = useSelector(state=>state.movie.categorizedMovies) ;
    const loading= useSelector(state=>state.movie.loading);
    const dispatch = useDispatch();
    const navigate = useNavigate();
   
    const openDetailsPage=(movieId,categoryId)=>{
        navigate("/user/categories/categoryId/movies/movieId")
        dispatch(movieActions.setSelectedCategoryId(categoryId));
        dispatch(movieActions.setSelectedMovieId(movieId));
        

    }
    return (
      <div className="dashboard">
        <h1>Dashboard</h1>
        {loading ? (
          <p>Loading...</p> // Replace with a spinner or loader component
        ) : (
          categories.map((category) => (
            <div key={category.id} className="category-section">
              <h2>{category.name}</h2>
              {category.movies && category.movies.length > 0 ? (
                <div className="movies-grid">
                  {category.movies.map((movie) => (
                    <div
                      key={movie.id}
                      className="movie-card"
                      onClick={() => openDetailsPage(movie.id,category.id)}
                    >
                      <img
                        src={movie.moviePoster || "/default-poster.jpg"}
                        alt={movie.name}
                        className="movie-poster-d"
                      />
                      <div className="movie-details">
                        <h3>{movie.name}</h3>
                        <p>{movie.releaseDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No movies in this category. Please add movies.</p>
              )}
            </div>
          ))
        )}
      </div>
    );
  };
  
  export default Dashboard;
  