// import { FavoriteBorder, FavoriteBorderOutlined } from "@mui/icons-material";
// import { useSelector } from "react-redux";

// const IsCommentLiked = ({ comment }) => {
//   const loggedInUserId = useSelector((state) => state.user._id);
//   const isLiked = comment.likes && comment.likes[loggedInUserId];

//   return <>{isLiked ? <FavoriteBorder /> : <FavoriteBorderOutlined />}</>;
// };

// export default IsCommentLiked;

import React from "react";
import { FavoriteBorderOutlined, FavoriteOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useTheme } from "@emotion/react";

const IsCommentLiked = ({ comment }) => {
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = comment.likes && comment.likes[loggedInUserId];
  const { palette } = useTheme();

  return (
    <>
      {isLiked ? (
        <FavoriteOutlined sx={{ color: palette.primary.main }} />
      ) : (
        <FavoriteBorderOutlined />
      )}
    </>
  );
};

export default IsCommentLiked;
