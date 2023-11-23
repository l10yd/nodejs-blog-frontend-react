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

export const AddComment = () => {
  const [text, setText] = React.useState("");

  //вытаскиваем id поста из ссылки на страницу
  const { id } = useParams();

  //передаем на сервер статью целиком
  const onSubmit = async () => {
    try {
      const data = { text, postId: id };

      //передаем новый комментарий на сервер
      await axios.post("/comments", data);
    } catch (error) {
      console.warn(error);
      alert("Ошибка при создании комментария");
    }
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src="https://mui.com/static/images/avatar/5.jpg"
        />
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            onChange={(e) => setText(e.target.value)}
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
