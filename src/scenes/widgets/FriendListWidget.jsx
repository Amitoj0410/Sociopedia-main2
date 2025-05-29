import {
  Box,
  CircularProgress,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";

const FriendsListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const [gettingFriends, setGettingFriends] = useState(false);

  const getFriends = async () => {
    try {
      setGettingFriends(true);
      const response = await fetch(
        `https://socialpedia-server-main-v2.onrender.com/users/${userId}/friends`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      dispatch(setFriends({ friends: data }));
    } catch (error) {
      console.log(error);
    } finally {
      setGettingFriends(false);
    }
  };

  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     getFriends();
  //   }, 5000);

  //   return () => clearInterval(intervalId);
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {gettingFriends ? (
        <CircularProgress />
      ) : (
        <WidgetWrapper>
          <Typography
            color={palette.neutral.dark}
            variant="h5"
            fontWeight="500"
            sx={{ mb: "1.5rem" }}
          >
            Friends List
            <Divider />
          </Typography>
          <Box display="flex" flexDirection="column" gap="1.5rem">
            {Array.isArray(friends) &&
              friends.map((friend, index) => (
                <Friend
                  // key={friend._id}
                  key={`${friend._id}-${index}`}
                  friendId={friend._id}
                  name={`${friend.firstName} ${friend.lastName}`}
                  subtitle={friend.occupation}
                  // userPicturePath={friend.picturePath}
                  userPicturePath={
                    friend.picturePath ? friend.picturePath : "p1.jpeg"
                  }
                />
              ))}
          </Box>
        </WidgetWrapper>
      )}
    </>
  );
};

export default FriendsListWidget;
