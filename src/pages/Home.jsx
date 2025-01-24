import React from "react";
import Player from "../components/Player";

const Home = () => {
  return (
    <div className="home-page">
      <h1>Home</h1>
      <Player url="https://www.w3schools.com/html/mov_bbb.mp4" platform="web" />

    </div>
  );
};

export default Home;
