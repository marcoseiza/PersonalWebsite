import { Circle } from "phosphor-react";
import type { TaskGroup } from "../../helpers";
import Skeleton from "./skeleton";

interface TaskColumnProps {
  group?: TaskGroup;
}

export default function TaskColumn({ group }: TaskColumnProps) {
  return (
    <div className="react-task-column react-flex column">
      <div className="react-task-column-title">
        <div className="react-task-column-icon">
          <Circle
            size={24}
            weight="fill"
            color={`var(--group-color-${group?.groupInfo.color || "black"})`}
          />
        </div>
        <h3>{group?.groupInfo.name || <Skeleton />}</h3>
      </div>
      <ul className={group ? "" : "react-task-column-skeleton"}>
        {group?.tasks.map((task, i) => (
          <li className="react-task-column-item" key={i}>
            <h4 className="react-task-column-item-desc">{task.name}</h4>
          </li>
        )) || <Skeleton />}
      </ul>
    </div>
  );
}
