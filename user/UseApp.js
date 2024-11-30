import MainPage from "./pages/Mainpage";
import React from "react";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import { Routes, Route } from "react-router-dom";
import Login from "../components/authentication/Login";
import BookTicket from "./components/BookTicket";
const UserApp=()=>{
  return (
    <>
    <Routes>
      <Route path="/" element={<MainPage/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/categories/categoryId/movies/movieId" element={<MovieDetailsPage/>}/>
      <Route path="/book-ticket/movieId" element={<BookTicket/>}/>
    </Routes>
    </>
  )

};  export default UserApp;