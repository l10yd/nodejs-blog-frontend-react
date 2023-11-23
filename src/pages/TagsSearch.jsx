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

import { useParams } from "react-router-dom";

export const TagsSearch = () => {
  const dispatch = useDispatch();
  const { posts, tags } = useSelector((state) => state.posts);
  const userData = useSelector((state) => state.auth.data);

  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  const [selectedTab, setSelectedTab] = React.useState(0);

  //вытаскиваем нужный тег из ссылки на страницу
  const { id } = useParams();

  // получаем посты и теги с бэка, можно это делать и в App.js
  React.useEffect(() => {
    dispatch(fetchPosts());
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

  // Фильтрация постов, чтобы отображались только те, у которых tags содержит id
  const filteredPosts = React.useMemo(() => {
    return sortedPosts.filter((post) => post.tags.includes(id));
  }, [id, sortedPosts]);

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
          {(isPostsLoading ? [...Array(5)] : filteredPosts).map((obj, index) =>
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
                commentsCount={3}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
              />
            )
          )}
        </Grid>
      </Grid>
    </>
  );
};
