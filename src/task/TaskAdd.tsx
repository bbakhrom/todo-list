import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { config } from "../config/config";
import { initializeApp } from "firebase/app";
import { collection, getFirestore, setDoc, doc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
const dayjs = require("dayjs");

const app = initializeApp(config.firebaseConfig);
const db = getFirestore(app);

function TaskAdd() {
  const navigate = useNavigate();
  const [progress, setSetProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachFileUrl, setAttachFileUrl] = useState<any>(null);
  const [endDate, setEndDate] = useState("");

  /**
   * Get selected file and upload file.
   * @param event params
   */
  const handleChange = (event: any) => {
    event.preventDefault();
    const file = event.target.files[0];
    uploadFiles(file);
  };

  /**
   * Upload file and reacord in database.
   * @param file object.
   * @returns
   */
  const uploadFiles = (file: any) => {
    if (!file) return;

    const storage = getStorage();
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog =
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setSetProgress(prog);
      },
      (err) => console.log("err: ", err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) =>
          setAttachFileUrl(url)
        );
      }
    );
  };

  /**
   * Create payload and save payload in database.
   * after change navigate to task list.
   * @param event param
   */
  async function handleSubmit(event: any) {
    event.preventDefault();

    const tasksRef = collection(db, "tasks");
    const randomId = Math.floor(Math.random() * 50);

    await setDoc(doc(tasksRef, String(randomId)), {
      id: randomId,
      title: title,
      description: description,
      attachFile: attachFileUrl,
      createdDate: dayjs().format("YYYY-MM-DD"),
      endDate: endDate,
      status: "открытый",
    });
    navigate("/");
  }

  return (
    <div>
      <Link to="/">Назад</Link>
      <br />
      <input
        type="text"
        placeholder="введите загаловок"
        onChange={(e) => setTitle(e.target.value)}
      />

      <br />
      <input
        type="text"
        placeholder="введите описание"
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />
      <input
        placeholder="дата окончания"
        onChange={(e) => setEndDate(e.target.value)}
        type="date"
        data-date-format="DD MMMM YYYY"
      />
      <br />

      <br />
      <h1>Прикрепить файл к задаче</h1>
      <input type="file" onChange={handleChange} />
      <h3>Загрузка {progress} %</h3>

      <br />
      <button type="button" onClick={handleSubmit}>
        Сохранить
      </button>
    </div>
  );
}

export default TaskAdd;
