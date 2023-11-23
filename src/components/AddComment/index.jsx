import React from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

import axios from "../../axios";

import "easymde/dist/easymde.min.css";

import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import { useNavigate, Navigate, useParams } from "react-router-dom";

export const AddComment = ({ updateComments }) => {
  const [text, setText] = React.useState("");
  const avatarUrl = useSelector((state) => state.auth.data.avatarUrl);

  //вытаскиваем id поста из ссылки на страницу
  const { id } = useParams();

  //передаем на сервер статью целиком
  const onSubmit = async () => {
    try {
      const data = { text, postId: id };
      //передаем новый комментарий на сервер
      await axios.post("/comments", data);
      //обновляет счетчик комментариев
      await axios.get(`/posts/${id}/comments`);
      setText("");
      //обновляем родительский компонент, чтобы комменты перерисовались
      updateComments();
    } catch (error) {
      console.warn(error);
      alert("Ошибка при создании комментария");
    }
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar classes={{ root: styles.avatar }} src={avatarUrl} />
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            onChange={(e) => setText(e.target.value)}
            value={text}
            fullWidth
          />
          <Button onClick={onSubmit} variant="contained">
            Отправить
          </Button>
        </div>
      </div>
    </>
  );
};
