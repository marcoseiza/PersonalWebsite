import { Circle } from "phosphor-react";
import type { TaskBoard, TaskGroup } from "../../helpers";
import NotionLogo from "./notion-logo";
import TaskColumn from "./task-column";

interface TaskCardProps {
  taskBoard: TaskBoard;
}

export default function TaskCard({ taskBoard }: TaskCardProps) {
  const taskGroups: TaskGroup[] = Array.from(taskBoard.values());
  return (
    <div className="react-card">
      <div className="react-task-card-title">
        <div className="react-task-card-title-logo">
          <NotionLogo />
        </div>
        <h2 className="fancy-text react-article-title">My Current Tasks</h2>
      </div>
      <div className="react-task-board">
        {taskGroups.map((group, i) => {
          return <TaskColumn group={group} key={i} />;
        })}
      </div>
    </div>
  );
}
