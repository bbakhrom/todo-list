import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { config } from "../config/config";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
} from "firebase/firestore";
const dayjs = require("dayjs");

const app = initializeApp(config.firebaseConfig);
const db = getFirestore(app);

/**
 * Find taks by ID from database and return Task.
 * @param id task ID.
 * @returns
 */
async function getTaskById(id: string) {
  const docTask = doc(db, "tasks", id);
  try {
    const docSnap = await getDoc(docTask);
    return docSnap.data();
  } catch (error) {
    console.log(error);
  }
}

function TaskEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [taskId, setTaskId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    (async () => {
      const taskById = await getTaskById(String(id));
      if (taskById) {
        setTaskId(taskById.id);
        setTitle(taskById.title);
        setDescription(taskById.description);
        setEndDate(taskById.endDate);
        setCreatedDate(taskById.createdDate);
        setStatus(taskById.status);
      }
    })();
  }, [id]);

  /**
   * Save change in database.
   */
  async function saveTask() {
    const tasksRef = collection(db, "tasks");

    await setDoc(doc(tasksRef, String(taskId)), {
      id: taskId,
      title: title,
      createdDate: createdDate,
      description: description,
      attachFile: "",
      endDate: endDate,
      status: status,
    });
    navigate(`/view/${taskId}`);
  }

  return (
    <div>
      <span>
        <span>Загаловок: </span>
        <span>
          <input
            type="text"
            placeholder="введите загаловок"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </span>
      </span>

      <br />

      <span>
        <span>Описание: </span>
        <span>
          <input
            type="text"
            placeholder="введите описание"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </span>
      </span>

      <br />
      <span>
        <span>Дата окончания: </span>
        <span>
          <input
            placeholder="дата окончания"
            onChange={(e) => setEndDate(e.target.value)}
            type="date"
            data-date-format="DD MMMM YYYY"
            value={endDate}
          />
        </span>
      </span>

      <br />
      <span>
        <span>Статус: </span>
        <span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="открытый">Открытый</option>
            <option value="закрытый">Закрытый</option>
          </select>
        </span>
      </span>

      <p>Дата начало: {createdDate}</p>

      <button type="button" onClick={saveTask}>
        Сохранить
      </button>
      <Link to={`/view/${id}`}>Назад</Link>
    </div>
  );
}

export default TaskEdit;
