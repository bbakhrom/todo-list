import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import { config } from "../config/config";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

interface Task {
  id: number;
  title: "";
  description: "";
  createdDate: "";
  attachFile: "";
  endDate: "";
  status: null;
}

function TaskList() {
  const [tasklist, setTaskList] = useState<Task[]>([]);

  const app = initializeApp(config.firebaseConfig);
  const db = getFirestore(app);

  /**
   * Get all tasks from the database.
   * @returns all tasks from the database.
   */
  async function getTaskList() {
    const tasksCol = collection(db, "tasks");
    const taskSnapshot = await getDocs(tasksCol);
    const taskList = taskSnapshot.docs.map((doc) => doc.data());
    return taskList;
  }

  useEffect(() => {
    (async () => {
      const taskArray = await getTaskList();
      setTaskList(taskArray as any);
    })();
  }, []);

  return (
    <div>
      <Link to="/add">Создать новую задачу</Link>
      <br />
      {tasklist.length > 0 ? (
        <>
          {tasklist.map((task) => {
            return (
              <Link key={`${task.id}`} to={`view/${task.id}`}>
                <span>
                  {task.title}
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
                <br />
              </Link>
            );
          })}
        </>
      ) : null}
    </div>
  );
}

export default TaskList;
