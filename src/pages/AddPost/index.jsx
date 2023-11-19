import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
//готовый редактор
import SimpleMDE from "react-simplemde-editor";

import axios from "../../axios";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import { useNavigate, Navigate, useParams } from "react-router-dom";

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);

  const [isLoading, setLoading] = React.useState(false);
  const [text, setText] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");

  const inputFileRef = React.useRef(null);

  const isEditing = Boolean(id);

  //передает выбранную картинку на сервер
  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      //вытаскиваем файл из инпута
      const file = event.target.files[0];
      //создаем запрос формата "image": картинка
      formData.append("image", file);
      //уже здесь грузим на сервер, при этом получаем json {url: "ссылка"}
      const { data } = await axios.post("/upload", formData);
      //теперь эта ссылка используется для отображения картинки на фронте
      setImageUrl(data.url);
    } catch (error) {
      console.warn(error);
      alert("Ошибка при загрузке файла");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  //simpleMDE работает через callback
  //просто контролируемый инпут для основного текста статьи
  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  //передаем на сервер статью целиком
  const onSubmit = async () => {
    try {
      setLoading(true);
      //если редактируем, то с бека придет массив тегов
      //если новая статья, разбиваем строчку тегов и передаем как массив
      const tagsArr = Array.isArray(tags)
        ? tags
        : typeof tags === "string"
        ? tags.split(",").map((tag) => tag.trim())
        : [];

      const fields = {
        title,
        imageUrl,
        tags: tagsArr,
        text,
      };
      //передаем статью на сервер, получаем данные в ответ
      //пишем новую или редактируем текущую
      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts", fields);
      //из useParams или данных с бэка берем id статьи
      const _id = isEditing ? id : data._id;
      //отправляем пользователя на эту опубликованную статью
      navigate(`/posts/${_id}`);
    } catch (error) {
      console.warn(error);
      alert("Ошибка при создании статьи");
    }
  };

  //если запущен режим редактирования
  React.useEffect(() => {
    //из useParams - номер статьи
    if (id) {
      //получаем все данные статьи с бэка и заполняем стейты ими
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setText(data.text);
          setImageUrl(data.imageUrl);
          setTags(data.tags);
        })
        .catch((err) => {
          console.warn(err);
          alert("Ошибка при получении статьи");
        });
    }
  }, []);

  //чтобы без ререндеров - useMemo
  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  //если не авторизован и в локалстораже нет ничего, переходит на главную
  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        //ссылка на реф, чтобы при нажатии на кнопку начинался инпут файла
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
        Загрузить превью
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>
          <img
            className={styles.image}
            src={`http://localhost:4444${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Сохранить" : "Опубликовать"}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
