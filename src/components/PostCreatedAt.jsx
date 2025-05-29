// import { useSelector } from "react-redux";

// const PostCreatedAt = ({ postId }) => {
//   const token = useSelector((state) => state.token);

//   const getPost = async () => {
//     const response = await fetch(
//       `https://socialpedia-server-main-v2.onrender.com/posts/${postId}`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     const post = await response.json();
//     console.log(post.createdAt);
//   };
//   return <div></div>;
// };

// export default PostCreatedAt;

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

const PostCreatedAt = ({ postId }) => {
  const token = useSelector((state) => state.token);
  const [createdAt, setCreatedAt] = useState(null);

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await fetch(
          `https://socialpedia-server-main-v2.onrender.com/posts/${postId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const post = await response.json();
        setCreatedAt(post.createdAt);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    const isFirstLoad = localStorage.getItem("firstLoad");

    if (!isFirstLoad) {
      localStorage.setItem("firstLoad", "true");
    } else {
      getPost();
    }
  }, [postId, token]);

  // const timeAgo = createdAt
  //   ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
  //   : "Loading...";

  const timeAgo = createdAt
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
        .replace("about ", "")
        .replace(" hours", "hr")
        .replace(" hour", "hr")
        .replace(" minutes", "min")
        .replace(" minute", "min")
        .replace(" seconds", "sec")
        .replace(" second", "sec")
    : "Loading...";

  return <div>{timeAgo}</div>;
};

export default PostCreatedAt;
