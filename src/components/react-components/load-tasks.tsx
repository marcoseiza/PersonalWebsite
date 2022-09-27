import { useEffect, useState } from "react";
import { DefaultTasks, Tasks } from "../../helpers";
import TaskCard from "./task-card";

interface LoadTasksProps {
  databaseId: string;
}

export default function LoadTasks({ databaseId }: LoadTasksProps) {
  const [tasks, setTasks] = useState<Tasks>(DefaultTasks);
  const [isDoneLoading, setDoneLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchNotionTasks = async () => {
      const response = await fetch("./notion-tasks", {
        method: "POST",
        body: JSON.stringify({ database_id: databaseId }),
      });
      const tasks = (await response.json()).tasks;
      setTasks(tasks);
      setDoneLoading(true);
    };

    fetchNotionTasks();
  }, []);

  return <TaskCard tasks={tasks} isDoneLoading={isDoneLoading} />;
}
