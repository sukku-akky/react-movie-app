import React from 'react'
import Header from './Header'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import "./MovieDetailsHeader.css";
import { FaArrowLeft } from "react-icons/fa";
import { BiSearch } from "react-icons/bi"; // Search Icon
import logo from "../../assets/versatile-corporate-identity-logo-pack_1150526-2773.jpg";
import { movieActions } from '../../store/redux-store';
const MovieDetailsHeader = () => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const backwardFunction=()=>{
        navigate("/user");
        dispatch(movieActions.clearSelectedMovie());

    }
  return (
    <header className="header-md">
    <div className='arrow'><FaArrowLeft onClick={backwardFunction}/></div>
      <div className="header__logo-md">
        <img src={logo} alt="logo" className="logo" />
      </div>
      <div className="header__search">
        <BiSearch className="header__search-icon" />
        <input
          type="text"
          placeholder="Search..."
          className="header__search-input"
        />
      </div>
      
    </header>
  );
}

export default MovieDetailsHeader