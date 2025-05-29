import WidgetWrapper from "components/WidgetWrapper";
import { Typography, useTheme, Box, Divider } from "@mui/material";
import Friend from "components/Friend";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchResults } from "state";
import PostWidget from "./PostWidget";

const LoadSearchResults = ({ type, value }) => {
  //   const friends = [];
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const searchResults = useSelector((state) => state.searchResults);
  const usersArray = type === "people" ? searchResults.people : null;
  const postsArray = type === "posts" ? searchResults.posts : null;

  const getSearchedUsers = async () => {
    const response = await fetch(
      `https://socialpedia-serverr.onrender.com/users/search?firstName=${value}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const users = await response.json();
    dispatch(setSearchResults({ people: users })); //here users is an array of user objects
  };

  const getSearchedPosts = async () => {
    const response = await fetch(
      `https://socialpedia-serverr.onrender.com/posts/search?description=${value}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const posts = await response.json();
    dispatch(setSearchResults({ posts: posts })); //here users is an array of user objects
  };

  useEffect(() => {
    if (type === "people") {
      getSearchedUsers();
    } else {
      getSearchedPosts();
    }
  }, [type, value]);

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.main}
        variant="h5"
        fontWeight="500"
        // sx={{ mb: "1.5rem" }}
      >
        Search Results
      </Typography>
      <Divider sx={{ mb: "1rem" }} />
      {type === "people" && (
        <Box display="flex" flexDirection="column" gap="1.5rem">
          {Array.isArray(usersArray) && usersArray.length > 0 ? (
            usersArray.map((singleUser, index) => (
              <Friend
                key={`${singleUser._id}-${index}`}
                friendId={singleUser._id}
                name={`${singleUser.firstName} ${singleUser.lastName}`}
                subtitle={singleUser.occupation}
                userPicturePath={
                  singleUser.picturePath ? singleUser.picturePath : "p1.jpeg"
                }
              />
            ))
          ) : (
            <Box>No users found</Box>
          )}
        </Box>
      )}
      {type === "posts" && (
        <Box display="flex" flexDirection="column" gap="1.5rem">
          {Array.isArray(postsArray) && postsArray.length > 0 ? (
            postsArray.map(
              ({
                _id,
                userId,
                firstName,
                lastName,
                description,
                location,
                picturePath,
                videoPath,
                userPicturePath,
                likes,
                comments,
              }) => (
                <Box sx={{ border: `2px solid black`, borderRadius: "5px" }}>
                  <PostWidget
                    key={_id}
                    postId={_id}
                    postUserId={userId}
                    name={`${firstName} ${lastName}`}
                    description={description}
                    location={location}
                    picturePath={picturePath}
                    videoPath={videoPath}
                    userPicturePath={userPicturePath}
                    likes={likes}
                    comments={comments}
                  />
                </Box>
              )
            )
          ) : (
            <Box>No posts found</Box>
          )}
        </Box>
      )}
      {/* {type === "posts" && <Box>
        
        </Box>} Array.isArray(postsArray) ? (
        postsArray.map(
          ({
            _id,
            userId,
            firstName,
            lastName,
            description,
            location,
            picturePath,
            userPicturePath,
            likes,
            comments,
          }) => (
            <PostWidget
              key={_id}
              postId={_id}
              postUserId={userId}
              name={`${firstName} ${lastName}`}
              description={description}
              location={location}
              picturePath={picturePath}
              userPicturePath={userPicturePath}
              likes={likes}
              comments={comments}
            />
          )
        )
      ) : (
        <Box>No posts found</Box>
      )} */}
    </WidgetWrapper>
  );
};

export default LoadSearchResults;
