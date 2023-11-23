import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

//кастомная оболочка из axios.js, localhost:4444
import axios from "../axios";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import { fetchPosts, fetchTags } from "../redux/slices/posts";
import { fetchLastComments } from "../redux/slices/comments";

export const Home = () => {
  const dispatch = useDispatch();
  const { posts, tags } = useSelector((state) => state.posts);
  const userData = useSelector((state) => state.auth.data);
  const comments = useSelector((state) => state.comments.lastComments);

  const isCommentsLoading = comments.status === "loading";
  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  const [selectedTab, setSelectedTab] = React.useState(0);

  // получаем посты и теги и последние 5 комментов из бд с бэка, можно это делать и в App.js
  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
    dispatch(fetchLastComments());
  }, [dispatch]);

  //сортировка статей по новизне или просмотрам, потом это будет мэпиться в рендере
  const sortedPosts = React.useMemo(() => {
    if (selectedTab === 0) {
      // Сортировка по createdAt для "Новые"
      return [...posts.items].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else {
      // Сортировка по viewsCount для "Популярные"
      return [...posts.items].sort((a, b) => b.viewsCount - a.viewsCount);
    }
  }, [selectedTab, posts.items]);

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={selectedTab}
        onChange={(_, newValue) => setSelectedTab(newValue)}
        aria-label="basic tabs example"
      >
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : sortedPosts).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                id={obj._id}
                key={index}
                title={obj.title}
                imageUrl={
                  obj.imageUrl && `http://localhost:4444${obj.imageUrl}`
                }
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={obj.commentsCount}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
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
        </Grid>
      </Grid>
    </>
  );
};
