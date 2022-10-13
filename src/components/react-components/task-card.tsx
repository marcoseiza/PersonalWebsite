import { useState } from "react";
import type { TaskBoard, TaskGroup } from "../../helpers";
import NotionLogo from "./notion-logo";
import TaskColumn from "./task-column";

interface TaskCardProps {
  taskBoard: TaskBoard;
  getAllTasks: () => Promise<void>;
}

export default function TaskCard({ taskBoard, getAllTasks }: TaskCardProps) {
  const taskGroups: TaskGroup[] = Array.from(taskBoard.values());
  const hasUnloadedPosts: boolean = taskGroups.some(
    (group) => group?.numberOfUnloadedPosts > 0
  );
  const [showLoadMore, setShowLoadMore] = useState<boolean>(false);

  return (
    <div className="react-card">
      <div className="react-task-card-title">
        <h2 className="fancy-text react-article-title">My Current Tasks</h2>
        <div className="react-task-card-powered-by-notion">
          <div className="react-task-card-title-logo">
            <NotionLogo />
          </div>
          <h4>Powered by Notion</h4>
        </div>
      </div>
      <div className="react-task-board">
        {taskGroups.map((group, i) => {
          return (
            <TaskColumn group={group} key={i} showLoadMore={showLoadMore} />
          );
        })}
      </div>
      {hasUnloadedPosts && (
        <button
          className="react-task-card-load-more"
          onClick={async () => {
            setShowLoadMore(true);
            await getAllTasks();
            setShowLoadMore(false);
          }}
        >
          Load More Tasks
        </button>
      )}
    </div>
  );
}
