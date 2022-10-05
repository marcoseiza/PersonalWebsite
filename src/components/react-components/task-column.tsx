import { Circle } from "phosphor-react";
import type { TaskGroup } from "../../helpers";
import Skeleton from "./skeleton";
import Color from "color";

interface TaskColumnProps {
  group?: TaskGroup;
  showLoadMore?: boolean;
}

export default function TaskColumn({ group, showLoadMore }: TaskColumnProps) {
  const groupColor = Color(group?.groupInfo.color)
    .desaturate(0.4)
    .lighten(0.3)
    .string();
  return (
    <div className="react-task-column react-flex column">
      <div className="react-task-column-title">
        <div className="react-task-column-icon">
          <Circle size={24} weight="fill" color={groupColor} />
        </div>
        <h3>{group?.groupInfo.name || <Skeleton />}</h3>
      </div>
      <ul className={group ? "" : "react-task-column-skeleton"}>
        {group?.tasks.map((task, i) => (
          <li className="react-task-column-item" key={i}>
            <h4 className="react-task-column-item-desc">{task.name}</h4>
          </li>
        )) || (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        )}
        {showLoadMore &&
          group &&
          new Array(group.numberOfUnloadedPosts).fill(undefined).map(() => (
            <li>
              <Skeleton />
            </li>
          ))}
      </ul>
    </div>
  );
}
