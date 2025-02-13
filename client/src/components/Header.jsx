import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContent);

  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
      <img src={assets.header_img} alt="" className="w-52 h-52 rounded-full" />
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        {" "}
        Hey {userData ? userData.name : `Crocheter`}!
        <img className="w-8 aspect-square" src={assets.hand_wave} alt="" />
      </h1>
      <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
        Welcome to our website
      </h2>
      <p className="mb-8 mx-w-md">
        Welcome to BUDS Crochet, a dedicated platform designed for crochet
        enthusiasts of all skill levels. Whether you're just starting out or an
        experienced crocheter, this is the perfect place to bring your
        creativity to life. Here, you can design and share beautiful crochet
        patterns, explore a wide collection of patterns tailored to your
        interests, and connect with a vibrant community of fellow crocheters.
        Our interactive learning section provides step-by-step guidance to help
        you master new techniques, while built-in tools like the row counter
        make it easier to track your progress. Join us and be part of a space
        where creativity, learning, and community come together.
      </p>
      <span onClick={()=> navigate('/pattern-visualize')} className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all">
        Get Started
      </span>
    </div>
  );
};

export default Header;
