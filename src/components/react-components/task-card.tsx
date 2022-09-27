import { Circle } from "phosphor-react";
import type { Tasks } from "../../helpers";
import NotionLogo from "./notion-logo";
import TaskColumn from "./task-column";

interface TaskCardProps {
  tasks: Tasks;
  isDoneLoading: boolean;
}

export default function TaskCard({ tasks, isDoneLoading }: TaskCardProps) {
  return (
    <div className="react-card">
      <div className="react-task-card-title">
        <NotionLogo />
        <h2 className="fancy-text react-article-title">My Current Tasks</h2>
      </div>
      <div className="react-task-board">
        <TaskColumn
          icon={<Circle size={24} weight="fill" color="var(--todo-color)" />}
          name="ToDo"
          tasks={tasks.ToDo}
          isDoneLoading={isDoneLoading}
        />
        <TaskColumn
          icon={<Circle size={24} weight="fill" color="var(--doing-color)" />}
          name="Doing"
          tasks={tasks.Doing}
          isDoneLoading={isDoneLoading}
        />
        <TaskColumn
          icon={<Circle size={24} weight="fill" color="var(--done-color)" />}
          name="Done"
          tasks={tasks.Done}
          isDoneLoading={isDoneLoading}
        />
      </div>
    </div>
  );
}
