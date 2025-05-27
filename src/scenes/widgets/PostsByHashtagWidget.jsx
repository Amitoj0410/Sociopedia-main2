import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostWidget from "./PostWidget";
import WidgetWrapper from "components/WidgetWrapper";
import { Box, Button, Typography } from "@mui/material";

const PostsByHashtagWidget = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const hashtagPosts = useSelector((state) => state.hashtagPosts) || []; // Default to empty array if null
  const [visiblePosts, setVisiblePosts] = useState(5);

  // useEffect(() => {
  //   // console.log(hashtagPosts);
  // }, [hashtagPosts]);

  const visiblePostsData = hashtagPosts.slice(0, visiblePosts);

  const handleLoadMore = () => {
    setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 5);
  };

  return (
    <>
      {visiblePostsData.length > 0 ? (
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
        )
      ) : (
        <WidgetWrapper
          mb={`2rem`}
          maxWidth={"35rem"}
          sx={{ wordWrap: "break-word" }}
          overflow={"hidden"}
        >
          <Typography variant="h3">
            Select a Trending hashtag to view its posts
          </Typography>
        </WidgetWrapper>
      )}
      {hashtagPosts.length > visiblePosts && (
        <Box display="flex" justifyContent="center">
          <Button variant="contained" onClick={handleLoadMore}>
            Load More
          </Button>
        </Box>
      )}
    </>
  );
};

export default PostsByHashtagWidget;
