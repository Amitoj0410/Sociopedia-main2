// import React, { useEffect, useRef } from "react";
// import Plyr from "plyr";
// import "plyr/dist/plyr.css";
// import "./VideoPlayer.css";
// import { useMediaQuery, useTheme } from "@mui/material";

// const VideoPlayer = ({ src, poster = "" }) => {
//   const videoRef = useRef(null);
//   const wrapperRef = useRef(null);
//   const plyrInstance = useRef(null);
//   const { breakpoints } = useTheme();
//   const isXs = useMediaQuery(breakpoints.only("xs"));
//   const isSm = useMediaQuery(breakpoints.only("sm"));

//   useEffect(() => {
//     const video = videoRef.current;
//     const wrapper = wrapperRef.current;

//     if (plyrInstance.current) {
//       plyrInstance.current.destroy();
//       plyrInstance.current = null;
//     }

//     video.src = src;
//     if (poster) video.poster = poster;
//     else video.removeAttribute("poster");

//     const onLoadedMetadata = () => {
//       if (!plyrInstance.current) {
//         // Add a unique ID to the wrapper for Plyr to target
//         if (!wrapper.id) {
//           wrapper.id = `plyr-container-${Math.random()
//             .toString(36)
//             .substr(2, 9)}`;
//         }

//         plyrInstance.current = new Plyr(video, {
//           controls: [
//             "play",
//             "progress",
//             "current-time",
//             "mute",
//             "volume",
//             "settings",
//             "fullscreen",
//             "speed",
//           ],
//           settings: ["quality", "speed", "loop"],
//           fullscreen: {
//             enabled: true,
//             fallback: true,
//             iosNative: false,
//             container: `#${wrapper.id}`, // Use the ID as selector
//           },
//         });
//       }
//       video.removeEventListener("loadedmetadata", onLoadedMetadata);
//     };

//     video.addEventListener("loadedmetadata", onLoadedMetadata);

//     // Cleanup on unmount
//     return () => {
//       if (plyrInstance.current) {
//         plyrInstance.current.destroy();
//         plyrInstance.current = null;
//       }
//       video.removeEventListener("loadedmetadata", onLoadedMetadata);
//       document.body.style.overflow = "";
//     };
//   }, [src, poster]);

//   return (
//     <div ref={wrapperRef} className="video-player-wrapper">
//       <video
//         ref={videoRef}
//         className="plyr"
//         controls
//         playsInline
//         style={{
//           maxHeight: isXs || isSm ? "300px" : "800px",
//         }}
//       />
//     </div>
//   );
// };

// export default VideoPlayer;

import React, { useEffect, useRef } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import "./VideoPlayer.css";
import { useMediaQuery, useTheme } from "@mui/material";

const VideoPlayer = ({ src, poster = "" }) => {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const plyrInstance = useRef(null);
  const { breakpoints } = useTheme();
  const isXs = useMediaQuery(breakpoints.only("xs"));
  const isSm = useMediaQuery(breakpoints.only("sm"));

  // ✅ Set --vh CSS variable for responsive height
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const wrapper = wrapperRef.current;

    if (plyrInstance.current) {
      plyrInstance.current.destroy();
      plyrInstance.current = null;
    }

    video.src = src;
    if (poster) video.poster = poster;
    else video.removeAttribute("poster");

    const onLoadedMetadata = () => {
      if (!plyrInstance.current) {
        if (!wrapper.id) {
          wrapper.id = `plyr-container-${Math.random()
            .toString(36)
            .substr(2, 9)}`;
        }

        plyrInstance.current = new Plyr(video, {
          controls: [
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "settings",
            "fullscreen",
            "speed",
          ],
          settings: ["quality", "speed", "loop"],
          fullscreen: {
            enabled: true,
            fallback: true,
            iosNative: false,
            container: `#${wrapper.id}`,
          },
        });
      }
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      if (plyrInstance.current) {
        plyrInstance.current.destroy();
        plyrInstance.current = null;
      }
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      document.body.style.overflow = "";
    };
  }, [src, poster]);

  return (
    <div ref={wrapperRef} className="video-player-wrapper">
      <video
        ref={videoRef}
        className="plyr"
        controls
        playsInline
        style={{
          maxHeight: isXs || isSm ? "300px" : "calc(var(--vh, 1vh) * 100)",
        }}
      />
    </div>
  );
};

export default VideoPlayer;
