import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  Close,
  WhatsApp,
  Instagram,
  Send,
  ArrowRight,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  TextField,
  List,
  ListItem,
  Menu,
  MenuItem,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import FindUserById from "components/FindUserById";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import IsCommentLiked from "components/IsCommentLiked";
import SpecialWidgetWrapper from "components/SpecialWidgetWrapper";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setHashtagPosts, setPost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  videoPath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const [newComment, setNewComment] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [patchingLike, setPatchingLike] = useState(false);

  const { palette, breakpoints } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const navigate = useNavigate();
  const isXs = useMediaQuery(breakpoints.only("xs"));
  const isSm = useMediaQuery(breakpoints.only("sm"));

  const videoRef = React.useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const patchLike = async () => {
    try {
      setPatchingLike(true);
      const response = await fetch(
        `https://socialpedia-server-main-v2.onrender.com/posts/${postId}/like`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: loggedInUserId }),
        }
      );
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error("Error liking post: ", error);
    } finally {
      setPatchingLike(false);
    }
  };

  const patchCommentLike = async (commId) => {
    try {
      const response = await fetch(
        `https://socialpedia-server-main-v2.onrender.com/posts/${postId}/comment/${commId}/like`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: loggedInUserId }),
        }
      );
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error("Error liking comment: ", error);
    }
  };

  const handleCommentSubmit = async () => {
    const trimmedComment = newComment.trim();
    const response = await fetch(
      `https://socialpedia-server-main-v2.onrender.com/posts/${postId}/comment`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: loggedInUserId,
          commentBody: trimmedComment,
        }),
      }
    );
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));

    // Update local state with the new comment if necessary
    setNewComment("");
  };

  const handleMoreIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleWhatsAppShare = () => {
    const shareableLink = `${picturePath}`;
    const shareableText = `${description}`;
    const message = `${shareableText}\n${shareableLink}`;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
  };
  // const handleWhatsAppShare = async () => {
  //   const shareableText = `${description}`;
  //   const shareableLink = `${picturePath}`;
  //   const message = `${shareableText}\n${shareableLink}`;

  //   if (picturePath) {
  //     // Trigger download of the image (optional)
  //     const a = document.createElement("a");
  //     a.href = picturePath;
  //     a.download = "image.jpg";
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);

  //     // Open WhatsApp with text (user must attach manually)
  //     const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
  //     window.open(whatsappLink, "_blank");
  //   } else {
  //     // Share text only
  //     window.open(
  //       `https://wa.me/?text=${encodeURIComponent(message)}`,
  //       "_blank"
  //     );
  //   }
  // };

  const handleInstagramShare = () => {
    // Handle Instagram share logic
  };

  const showPart2 = (currentComment) => {
    var resultArray = currentComment.split(":");
    var secondPart = resultArray.slice(1).join(":");
    return secondPart;
  };

  const parseTextWithHashtags = (text, primaryColor, handleHashtagClick) => {
    const parts = text.split(/(#[^\s]+)/g); // Split by hashtags
    return parts.map((part, index) =>
      part.startsWith("#") ? (
        <span
          key={index}
          style={{
            color: primaryColor,
            cursor: "pointer",
            textDecoration: "none",
          }}
          onMouseOver={(e) => {
            e.target.style.textDecoration = "underline";
          }}
          onMouseOut={(e) => {
            e.target.style.textDecoration = "none";
          }}
          onClick={() => handleHashtagClick(part)}
        >
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  const getPostsByHashtags = async (tag) => {
    try {
      const response = await fetch(
        `https://socialpedia-server-main-v2.onrender.com/hashtags/${tag}/posts`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch posts by hashtag");
      }
      const data = await response.json();
      dispatch(setHashtagPosts(data));
      // console.log(`Fetched posts for hashtag ${tag}:`, data); // Log to verify fetched data
    } catch (error) {
      console.error("Error fetching posts by hashtag:", error.message);
    }
  };

  const handleHashtagClick = (hashtag) => {
    // console.log(`Clicked on hashtag: ${hashtag}`);
    const cleanHashtag = hashtag.substring(1);

    // alert("hashtag clicked");
    // Add your onClick logic here
    navigate("/trending");
    getPostsByHashtags(cleanHashtag);
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullScreenNow =
        document.fullscreenElement === videoRef.current ||
        document.webkitFullscreenElement === videoRef.current;
      setIsFullscreen(isFullScreenNow);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  return (
    <SpecialWidgetWrapper
      mb={`2rem`}
      maxWidth={"35rem"}
      sx={{ wordWrap: "break-word" }}
      overflow={"hidden"}
    >
      <Box className="inner-icons">
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
          postId={postId}
        />
      </Box>
      <Typography
        color={main}
        sx={{
          mt: "1rem",
          fontSize: "1rem",
          overflow: "hidden",
        }}
        className="inner-icons"
      >
        {parseTextWithHashtags(description, primary, handleHashtagClick)}
      </Typography>
      {picturePath && (
        <Box sx={{ "&:hover": { cursor: "pointer" } }} className="inner-icons">
          <img
            width="100%"
            style={{
              borderRadius: "0.75rem",
              marginTop: "0.75rem",
              maxHeight: isXs || isSm ? "300px" : "500px", // adjust as needed
              objectFit: "cover", // or "contain" depending on what you want
            }}
            alt="post"
            src={picturePath}
          />
        </Box>
      )}
      {videoPath && (
        <Box sx={{ "&:hover": { cursor: "pointer" } }} className="inner-icons">
          {/* <video
            width="100%"
            controls
            style={{
              borderRadius: "0.75rem",
              marginTop: "0.75rem",
              maxHeight: isXs || isSm ? "300px" : "500px", // adjust as needed
              objectFit: "cover", // or "contain" depending on what you want
            }}
          >
            <source src={videoPath} type="video/mp4" />
            Your browser does not support the video tag.
          </video> */}
          <video
            ref={videoRef}
            width="100%"
            controls
            style={
              isFullscreen
                ? { borderRadius: "0.75rem", marginTop: "0.75rem" } // only minimal styles
                : {
                    borderRadius: "0.75rem",
                    marginTop: "0.75rem",
                    maxHeight: isXs || isSm ? "300px" : "500px",
                    objectFit: "cover",
                  }
            }
          >
            <source src={videoPath} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
      )}
      <FlexBetween mt="0.25rem" className="inner-icons">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton
              onClick={patchLike}
              sx={{
                "&:hover": {
                  backgroundColor: palette.primary.light,
                },
              }}
              disabled={patchingLike}
            >
              {patchingLike ? (
                <CircularProgress size={isXs || isSm ? 10 : 15} />
              ) : isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <>
          <IconButton
            sx={{ p: "0.6rem" }}
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleMoreIconClick}
          >
            <ShareOutlined />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={() => {
                handleWhatsAppShare();
              }}
              sx={{ color: "green", gap: "0.2rem" }}
            >
              <WhatsApp />
              <Typography>WhatsApp</Typography>
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleInstagramShare();
              }}
              sx={{ color: "#f028d4", gap: "0.2rem" }}
            >
              <Instagram />
              <Typography>Instagram</Typography>
            </MenuItem>
          </Menu>
        </>
      </FlexBetween>

      {isComments && (
        <Box
          mt="0.5rem"
          border={`3px solid ${main}`}
          borderRadius={`5px`}
          className="inner-icons"
        >
          <FlexBetween>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ mt: "0.3rem", ml: "0.4rem" }}
            >
              Comments
            </Typography>
            <IconButton
              sx={{
                mr: "0.5rem",
              }}
              onClick={() => setIsComments(!isComments)}
            >
              <Close />
            </IconButton>
          </FlexBetween>
          <Divider />
          <FlexBetween>
            <List
              sx={{
                maxHeight: "12rem",
                overflowY: "auto",
                width: "100%",
              }}
            >
              {Array.isArray(comments) &&
                comments.map((comment, index) => (
                  <FlexBetween key={index} sx={{ mb: "0.5rem" }}>
                    <ListItem>
                      <Typography component="div">
                        <FlexBetween>
                          <Box sx={{ display: "flex" }}>
                            <Box>
                              <FindUserById
                                userId={comment.userId}
                                commentTime={comment.timestamp}
                              />
                            </Box>
                            <ArrowRight sx={{ mt: "0.1rem" }} />
                            <Box sx={{ mt: "0.1rem" }}>{comment.body}</Box>
                          </Box>
                        </FlexBetween>
                      </Typography>
                    </ListItem>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        mr: "1rem",
                      }}
                    >
                      <IconButton
                        sx={{
                          "&:hover": {
                            backgroundColor: palette.primary.light,
                          },
                        }}
                        onClick={() => patchCommentLike(comment.id)}
                      >
                        <IsCommentLiked comment={comment} />
                      </IconButton>
                      <Typography>
                        {comment.likes ? Object.keys(comment.likes).length : 0}
                      </Typography>
                    </Box>
                    {index < comments.length - 1 && <Divider />}
                    {/* <Divider /> */}
                  </FlexBetween>
                ))}
            </List>
          </FlexBetween>
          <Box display="flex">
            <TextField
              label="Add a comment"
              fullWidth
              variant="outlined"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                newComment.length > 0 &&
                handleCommentSubmit() &&
                setNewComment("")
              }
            />
            <Box display="flex" justifyContent="center" alignItems="center">
              <IconButton
                onClick={() => {
                  if (newComment.length > 0) {
                    handleCommentSubmit();
                    setNewComment("");
                  }
                }}
              >
                <Send
                  sx={{
                    width: "2.5rem",
                    height: "2.5rem",
                    backgroundColor: palette.primary.main,
                    borderRadius: "0.5rem",
                  }}
                />
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}
    </SpecialWidgetWrapper>
  );
};

export default PostWidget;
