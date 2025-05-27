import React, { useEffect, useState } from "react";
import {
  PersonAddOutlined,
  PersonRemoveOutlined,
  MoreVertOutlined,
  ArrowRight,
} from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setFriendRequestTo, setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { setPosts } from "state";
import PostCreatedAt from "./PostCreatedAt";

const Friend = ({
  friendId,
  name,
  subtitle,
  userPicturePath,
  postId,
  friendReqs,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [friendUser, setFriendUser] = useState({ friendRequests: [] }); // Initialize with empty array for friendRequests
  const friends = useSelector((state) => state.user.friends);
  // console.og(friends);
  const { palette, breakpoints } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const [anchorEl, setAnchorEl] = useState(null);
  const [check, setCheck] = useState(false);
  const open = Boolean(anchorEl);
  const [patchingFriend, setPatchingFriend] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const isXs = useMediaQuery(breakpoints.only("xs"));
  const isSm = useMediaQuery(breakpoints.only("sm"));
  const isMd = useMediaQuery(breakpoints.only("md"));

  const size = isXs ? "45px" : "55px";

  const isFriend = friends.find((friend) => friend._id === friendId);
  const chkFriendReq = useSelector((state) => state.friendRequestsTo);
  // console.log(chkFriendReq);
  const sentFriendReq =
    friendReqs?.includes(_id) ||
    (chkFriendReq && chkFriendReq.includes(friendId));
  // const frSent = useSelector((state) => state.friendRequestsTo);

  // const sentFriendReq = useSelector((state) => state.friendRequestsTo);

  const handleMoreIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const patchFriend = async () => {
    try {
      setPatchingFriend(true);
      const response = await fetch(
        `http://localhost:3001/users/${_id}/${friendId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        dispatch(setFriends({ friends: data }));
      } else {
        throw new Error("Failed to update friends list");
      }
    } catch (error) {
      console.error("Error updating friends list:", error);
    } finally {
      setPatchingFriend(false);
    }
  };

  const sendRequest = async () => {
    try {
      setSendingRequest(true);
      const response = await fetch(
        `http://localhost:3001/users/${_id}/friends/${friendId}/request`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        dispatch(setFriendRequestTo(data._id));
      } else {
        throw new Error("Failed to send friend request");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    } finally {
      setSendingRequest(false);
    }
  };

  const deletePost = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const posts = await response.json();
        dispatch(setPosts({ posts }));
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // useEffect(() => {
  //   console.log(chkFriendReq);
  // }, [chkFriendReq]);

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            // navigate(0);
          }}
          sx={{
            "&:hover": { color: palette.neutral.main, cursor: "pointer" },
          }}
        >
          <UserImage image={userPicturePath} size={size} />
        </Box>
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            // navigate(0);
          }}
        >
          <Box display="flex">
            <Typography
              color={main}
              variant="h5"
              fontWeight="500"
              sx={{
                "&:hover": { color: palette.primary.light, cursor: "pointer" },
              }}
            >
              {name}&nbsp;
            </Typography>
            {postId && (
              <Box display="flex">
                <ArrowRight />
                <PostCreatedAt postId={postId} />
              </Box>
            )}
          </Box>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      {friendId === _id && postId ? (
        <>
          <IconButton
            sx={{ backgroundColor: primaryLight, pb: "0.6rem" }}
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleMoreIconClick}
          >
            <MoreVertOutlined sx={{ color: primaryDark }} />
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
                deletePost();
              }}
              sx={{ color: "red" }}
            >
              Delete
            </MenuItem>
          </Menu>
        </>
      ) : sentFriendReq && !isFriend ? (
        <Box
          sx={{
            border: "1px solid red",
            padding: "3px",
            borderRadius: "4px",
          }}
        >
          <Typography variant="body1">Request Sent</Typography>
        </Box>
      ) : isFriend ? ( //&& !sentFriendReq
        <IconButton
          onClick={() => patchFriend()}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
          disabled={patchingFriend}
        >
          {patchingFriend ? (
            <CircularProgress size={(isXs || isSm) && 20} />
          ) : (
            <Tooltip
              title={<Typography fontSize={13}>Remove Friend</Typography>}
              arrow
            >
              <PersonRemoveOutlined sx={{ color: primaryDark }} />
            </Tooltip>
          )}
        </IconButton>
      ) : (
        !isFriend &&
        !sentFriendReq && (
          <IconButton
            onClick={() => sendRequest()}
            sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
            disabled={sendingRequest}
          >
            {sendingRequest ? (
              <CircularProgress size={(isXs || isSm) && 20} />
            ) : (
              <Tooltip
                title={<Typography fontSize={13}>Add Friend</Typography>}
                arrow
              >
                <PersonAddOutlined sx={{ color: primaryDark }} />
              </Tooltip>
            )}
          </IconButton>
        )
      )}
    </FlexBetween>
  );
};

export default Friend;
