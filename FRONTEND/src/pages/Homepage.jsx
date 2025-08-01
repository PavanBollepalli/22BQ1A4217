import React from "react";
import UrlForm from "../components/UrlForm.jsx";
import Navbar from "../components/Navbar.jsx";

const Homepage = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 h-84 w-full mt-10">
        <UrlForm />
      </div>
    </>
  );
};

export default Homepage;
