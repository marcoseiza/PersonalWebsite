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

  useEffect(() => {
    (async () => {
      const response = await fetch("./notion-tasks", {
        method: "POST",
        body: JSON.stringify({ database_id: databaseId }),
      });
      setTaskBoard(ResponseJsonToTaskBoard(await response.json()));
    })();
  }, []);

  return <TaskCard taskBoard={taskBoard} />;
}
