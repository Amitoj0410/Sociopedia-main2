import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import WidgetWrapper from "components/WidgetWrapper";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const [visiblePosts, setVisiblePosts] = useState(5);
  const [gettingPosts, setGettingPosts] = useState(false);
  const [gettingUserPosts, setGettingUserPosts] = useState(false);

  const getPosts = async () => {
    try {
      setGettingPosts(true);
      const response = await fetch(
        `https://socialpedia-server-main-v2.onrender.com/posts`,
        {
          //doubt : /posts/ in fetch
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.log(error);
    } finally {
      setGettingPosts(false);
    }
  };

  const getUserPosts = async () => {
    try {
      setGettingUserPosts(true);
      const response = await fetch(
        `https://socialpedia-server-main-v2.onrender.com/posts/${userId}/posts`,
        {
          //doubt : /posts/ in fetch
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.log(error);
    } finally {
      setGettingUserPosts(false);
    }
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const visiblePostsData = Array.isArray(posts)
    ? posts.slice(0, visiblePosts)
    : [];
  const handleLoadMore = () => {
    setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 5);
  };

  return (
    <>
      {(gettingPosts || gettingUserPosts) && (
        <WidgetWrapper
          mb={`2rem`}
          maxWidth={"35rem"}
          sx={{
            wordWrap: "break-word",
            display: "flex",
            alignItems: "center",
          }}
          overflow={"hidden"}
        >
          <CircularProgress size={30} sx={{ mr: "1rem" }} />
          <Typography variant="h3">Loading Posts...</Typography>
        </WidgetWrapper>
      )}
      {Array.isArray(visiblePostsData) &&
        visiblePostsData.length > 0 &&
        !gettingPosts &&
        !gettingUserPosts &&
        visiblePostsData.map(
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
          )
        )}
      {Array.isArray(visiblePostsData) &&
        visiblePostsData.length === 0 &&
        !gettingPosts &&
        !gettingUserPosts && (
          <WidgetWrapper
            mb={`2rem`}
            maxWidth={"35rem"}
            sx={{ wordWrap: "break-word" }}
            overflow={"hidden"}
          >
            <Typography variant="h3">
              User didn't posted anything yet
            </Typography>
          </WidgetWrapper>
        )}
      {posts.length > visiblePosts && !gettingPosts && !gettingUserPosts && (
        <Box display="flex" justifyContent="center">
          <Button variant="contained" onClick={handleLoadMore}>
            Load More
          </Button>
        </Box>
      )}
    </>
  );
};

export default PostsWidget;
