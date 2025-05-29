import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserImage from "./UserImage";
import { Box } from "@mui/material";
import FlexBetween from "./FlexBetween";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";

const FindUserById = ({ userId, commentTime }) => {
  const [userFullName, setUserFullName] = useState("");
  const [picturePath, setPicturePath] = useState("");
  const [id, setId] = useState("");
  const [timeAgo, setTimeAgo] = useState("");
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();
  const { palette } = useTheme();
  useEffect(() => {
    // var resultArray = [];
    // var id = "";
    const fetchData = async () => {
      try {
        // resultArray = comment.split(":");
        // // setId(resultArray[0]);
        // // console.log(comment);
        // id = resultArray[0];

        const response = await fetch(
          `https://socialpedia-server-main-v2.onrender.com/users/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              // 'Content-type': 'Application/json', // You may add this if needed
            },
          }
        );

        if (response.ok) {
          const user = await response.json();
          //   console.log(user);

          if (user) {
            const name = `${user.firstName} ${user.lastName}`;
            setUserFullName(name);
            setPicturePath(user.picturePath);
            setId(user._id);
          }
        } else {
          console.error("Error fetching user data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    const calculateTimeAgo = (timestamp) => {
      const commentDate = new Date(timestamp);
      const currentDate = new Date();

      const timeDifferenceInSeconds = Math.floor(
        (currentDate - commentDate) / 1000
      );

      if (timeDifferenceInSeconds < 60) {
        return `${timeDifferenceInSeconds}s ago`;
      } else if (timeDifferenceInSeconds < 3600) {
        const minutesAgo = Math.floor(timeDifferenceInSeconds / 60);
        return `${minutesAgo}m ago`;
      } else if (timeDifferenceInSeconds < 86400) {
        const hoursAgo = Math.floor(timeDifferenceInSeconds / 3600);
        return `${hoursAgo}hr ago`;
      } else {
        const daysAgo = Math.floor(timeDifferenceInSeconds / 86400);
        return `${daysAgo}d ago`;
      }
    };
    const time = calculateTimeAgo(commentTime);
    setTimeAgo(time);
    fetchData();
  }, [userId, token, commentTime]); // Include userId and token as dependencies
  return (
    <FlexBetween
    // onClick={() => {
    //   navigate(`/profile/${id}`);
    //   // navigate(0);
    // }}
    >
      <Box
        sx={{ display: "inline", cursor: "pointer" }}
        onClick={() => {
          navigate(`/profile/${id}`);
        }}
      >
        <UserImage image={picturePath} size="40px" />
      </Box>
      <Box sx={{ ml: "0.3rem" }}>
        <Box
          sx={{
            color: palette.primary.main,
            "&:hover": { color: palette.primary.light, cursor: "pointer" },
          }}
          onClick={() => {
            navigate(`/profile/${id}`);
          }}
        >
          {userFullName}
        </Box>
        <Box fontSize={12} color={palette.neutral.medium}>
          {timeAgo}
        </Box>
      </Box>
    </FlexBetween>
  );
};

export default FindUserById;
