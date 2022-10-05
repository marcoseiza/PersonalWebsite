import { useEffect, useState } from "react";
import {
  DefaultTaskBoard,
  ResponseJsonToTaskBoard,
  TaskBoard,
} from "../../helpers";
import TaskCard from "./task-card";

interface LoadTasksProps {
  databaseId: string;
}

const numberOfTaskGroupSkeletons = 3;

export default function LoadTasks({ databaseId }: LoadTasksProps) {
  const [taskBoard, setTaskBoard] = useState<TaskBoard>(
    DefaultTaskBoard(numberOfTaskGroupSkeletons)
  );

  const getTasks = async (allPosts: boolean) => {
    const response = await fetch("./notion-tasks", {
      method: "POST",
      body: JSON.stringify({ database_id: databaseId, all_posts: allPosts }),
    });
    setTaskBoard(ResponseJsonToTaskBoard(await response.json()));
  };

  useEffect(() => {
    getTasks(false);
  }, []);

  return <TaskCard taskBoard={taskBoard} getAllTasks={() => getTasks(true)} />;
}
