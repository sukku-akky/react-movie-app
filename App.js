import AdminApp from "./admin/AdminApp";
import React, { useEffect } from "react";
import UserApp from "./user/UseApp";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useFetchCategoriesWithMovies from "./custom-hooks/fetch-movies";
function App() {
  const navigate = useNavigate();
 
  const isAdminLogged=useSelector(state=>state.movie.adminLogStatus);
  console.log(isAdminLogged);
  useFetchCategoriesWithMovies();
  useEffect(() => {
    // Navigate only if isAdminLogged explicitly changes
    if (isAdminLogged) {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  }, [isAdminLogged]);

  return (
    <div className="App">
      <Routes>
        {/* Protected Admin Route */}

        <Route path="/user/*" element={<UserApp />} />
        <Route
          path="/admin/*"
          element={isAdminLogged ? <AdminApp /> : <Navigate to="/user" />}
        />
      </Routes>
    </div>
  );
}

export default App;
