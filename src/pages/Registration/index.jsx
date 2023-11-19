import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { fetchRegister, selectIsAuth } from "../../redux/slices/auth";

import { Navigate } from "react-router-dom";

import styles from "./Login.module.scss";

export const Registration = () => {
  const dispatch = useDispatch();
  //boolean - авторизован или нет
  const isAuth = useSelector(selectIsAuth);

  //создается форма react hook form, деструктуризацией достаем следующее
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: "Penya Kamushkin",
      email: "vasya@yandex.ru",
      password: "1234",
    },
    mode: "onChange",
  });

  //к этому моменту введенные данные прошли валидацию
  //при нажатии на кнопку передает на сервер данные регистрации
  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values));
    if (!data.payload) {
      return alert("Не удалось зарегистрироваться");
    }
    //заодно сохраняем токен пользователя в localStorage
    if ("token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
    }
  };

  //после регистрации обратно на главную
  if (isAuth) {
    return <Navigate to="/" />;
  }
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          /*если есть ошибки, будет выводиться сообщение */
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          /*валидация для react hook form, как только поля рендерятся,
  они сразу регистрируются */
          {...register("fullName", { required: "Укажите полное имя!!" })}
          fullWidth
          label="Полное имя"
        />
        <TextField
          className={styles.field}
          /*если есть ошибки, будет выводиться сообщение */
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
          /*валидация для react hook form, как только поля рендерятся,
  они сразу регистрируются */
          {...register("email", { required: "Укажите почту!!" })}
          fullWidth
          label="E-Mail"
        />
        <TextField
          className={styles.field}
          /*если есть ошибки, будет выводиться сообщение */
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          /*валидация для react hook form, как только поля рендерятся,
  они сразу регистрируются */
          {...register("password", { required: "Укажите пароль!!" })}
          fullWidth
          label="Пароль"
        />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
