import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMovieDetails } from "../../store/movie-actions";
import "./MovieDetails.css";
function MovieDetails() {
  const categoryId = useSelector((state) => state.movie.selectedCategoryId);
  const movieId = useSelector((state) => state.movie.selectedMovieId);
  const navigate=useNavigate();
  const dispatch = useDispatch();
  const { selectedMovie, loading, error } = useSelector((state) => state.movie);
  const handleBookTicket=()=>{
    navigate("/user/book-ticket/movieId");


  }
  useEffect(() => {
    if (categoryId && movieId) {
      dispatch(fetchMovieDetails(categoryId, movieId)); // Fetch movie details
    }
  }, [dispatch, categoryId, movieId]);

  if (loading) return <p>Loading movie details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!selectedMovie) return <p>No movie details available.</p>;

  const {
    name,
    description,
    showtimes,
    moviePoster,
    heroImage,
    genre,
    language,
    director,
    imdbRating,
    releaseDate,
  } = selectedMovie;

  return (
    <div className="dt-d">
      {/* Movie Details Section */}
      <div className="movie-details">
        <h1 className="dt-head">{name}</h1>
        <div className="movie-info">
          <img src={moviePoster} alt="Movie Poster" className="movie-poster" />
          <div className="movie-text">
            <p className="dt-des">{description}</p>
            <p>
              <strong>Genre:</strong> {genre}
            </p>
            <p>
              <strong>Director:</strong> {director}
            </p>
            <p>
              <strong>Language:</strong> {language}
            </p>
            <p>
              <strong>IMDb Rating:</strong> {imdbRating}
            </p>
            <p>
              <strong>Release Date:</strong>{" "}
              {new Date(releaseDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="hero-image-container">
          <img src={heroImage} alt="Hero Image" className="hero-image" />
        </div>
      </div>
      
      <button className="book-btn" onClick={handleBookTicket}>Book Tickets</button>
     
    </div>
  );
}

export default MovieDetails;
