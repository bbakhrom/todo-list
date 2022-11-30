import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { config } from "../config/config";
import { initializeApp } from "firebase/app";
import { deleteDoc, doc, getDoc, getFirestore } from "firebase/firestore";
import dayjs from "dayjs";

interface TaskType {
  id: number;
  title: null;
  description: null;
  attachFile: null;
  createdDate: null;
  endDate: null;
  status: null;
}

const app = initializeApp(config.firebaseConfig);
const db = getFirestore(app);

/**
 * Find the required object(Task) from the database by ID.
 * @param id Task ID
 * @returns Task object
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

function TaskView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState<TaskType>();

  useEffect(() => {
    (async () => {
      const taskById = await getTaskById(String(id));
      setTask(taskById as any);
    })();
  }, [id]);

  /**
   * The function of deleting an object (task) in the database.
   * after change navigate to task list.
   * @param id Task ID
   */
  async function removeTask(id: string) {
    await deleteDoc(doc(db, "tasks", id));
    navigate("/");
  }

  /**
   * Route navigation by Task ID for edit.
   */
  async function editTask() {
    navigate(`/edit/${id}`);
  }

  return (
    <div>
      <Link to="/">Назад</Link>
      <br />
      {task ? (
        <div>
          <p>Название: {task.title}</p>
          <p>Описание: {task.description}</p>
          <p>Дата начало: {task.createdDate}</p>
          <p>Дата окончания: {task.endDate}</p>
          <span>
            Статус:
            <span>
              {task.status === "закрытый" ? (
                ` (${task.status})`
              ) : (
                <span>
                  {dayjs(task.endDate).diff(dayjs(dayjs()), "day") < 0
                    ? `Время закончилось`
                    : ` (${task.status} - ${dayjs(task.endDate).diff(
                        dayjs(dayjs()),
                        "day"
                      )} дня осталось)`}
                  {/* {task.status} до кончание осталось */}
                </span>
              )}
            </span>
          </span>
          <br />

          <button type="button" onClick={editTask}>
            Редактировать
          </button>

          <button type="button" onClick={() => removeTask(String(id))}>
            Удалить задачу
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default TaskView;
