import React, { useEffect, useRef, useState } from "react";
import "../styles/player.scss";

const Player = ({ url, platform, cv, udid }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleRewind = () => {
    videoRef.current.currentTime -= 5;
  };

  const handleFastForward = () => {
    videoRef.current.currentTime += 5;
  };

  const handleRestart = () => {
    videoRef.current.currentTime = 0;
  };

  useEffect(() => {
    if (platform === "tizen") {
      // Ejemplo: Configuración de Tizen con `cv` y `udid`
      cv.initializePlayer(videoRef.current, udid);
    } else if (platform === "webos") {
      // Ejemplo: Configuración de WebOS
      cv.setupWebOS(videoRef.current, udid);
    } else {
      // Navegadores
      const videoElement = videoRef.current;
      videoElement.src = url;
    }
  }, [url, platform, cv, udid]);

  return (
    <div className="player-container">
      <video ref={videoRef} className="player-video" controls />
      <div className="player-controls">
        <button onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button onClick={handleRewind}>Rewind 5s</button>
        <button onClick={handleFastForward}>Forward 5s</button>
        <button onClick={handleRestart}>Restart</button>
      </div>
    </div>
  );
};

export default Player;
