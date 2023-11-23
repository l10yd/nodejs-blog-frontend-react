import React from "react";

import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../axios";

import { Post } from "../components/Post";
import { AddComment } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import ReactMarkdown from "react-markdown";
import { fetchComments } from "../redux/slices/comments";

export const FullPost = () => {
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comments.comments);
  const isCommentsLoading = comments.status === "loading";

  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);
  const { id } = useParams();

  React.useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
      })
      .then(() => setIsLoading(false))
      .catch((err) => {
        console.warn(err);
        alert("Ошибка при получении статьи");
      });
  }, [id]);

  React.useEffect(() => {
    dispatch(fetchComments(id));
  }, [dispatch, id]);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      <Post
        id={data?._id}
        title={data.title}
        imageUrl={data.imageUrl && `http://localhost:4444${data.imageUrl}`}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <AddComment />
      {isCommentsLoading ? (
        <CommentsBlock isLoading={true} />
      ) : comments.items && comments.items.length > 0 ? (
        <CommentsBlock
          items={comments.items.map((comment) => ({
            user: {
              fullName: comment.user.fullName,
              avatarUrl: comment.user.avatarUrl,
            },
            text: comment.text,
          }))}
          isLoading={false}
        />
      ) : (
        <p>Нет комментариев</p>
      )}
    </>
  );
};
