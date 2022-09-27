import Skeleton from "./skeleton";

interface TaskColumnProps {
  name: string;
  icon?: JSX.Element;
  tasks: string[];
  isDoneLoading: boolean;
}

export default function TaskColumn({
  name,
  icon,
  tasks,
  isDoneLoading,
}: TaskColumnProps) {
  // isDoneLoading = false;
  return (
    <div className="react-task-column react-flex column">
      <div className="react-task-column-title">
        <div className="react-task-column-icon">{icon}</div>
        <h3>{name}</h3>
      </div>
      <ul className={!isDoneLoading ? "react-task-column-skeleton" : ""}>
        {isDoneLoading ? (
          tasks.map((task, i) => (
            <li className="react-task-column-item" key={i}>
              <h4 className="react-task-column-item-desc">{task}</h4>
            </li>
          ))
        ) : (
          <Skeleton />
        )}
      </ul>
    </div>
  );
}
