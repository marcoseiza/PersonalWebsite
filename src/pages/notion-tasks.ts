import { Client } from "@notionhq/client";
import {
  TaskGroupInfo,
  Task,
  TaskBoard,
  parseTasks,
  parseGroups,
  DefaultTaskBoardWithGroupInfos,
  FillTaskBoard,
  TaskBoardToResponseBody,
} from "../helpers";

export async function post({ request }: any) {
  const data = await request.json();

  if (data.database_id === undefined) {
    return new Response(
      JSON.stringify({
        statusText: '"database_id" not defined in request body',
      }),
      { status: 400 }
    );
  }

  const notion = new Client({ auth: import.meta.env.NOTION_SECRET });
  let tasks: Task[];
  let groupInfos: TaskGroupInfo[];

  try {
    tasks = await notion.databases
      .query({
        database_id: data.database_id,
      })
      .then((r: any) => parseTasks(r));
    groupInfos = await notion.databases
      .retrieve({
        database_id: data.database_id,
      })
      .then((r: any) => parseGroups(r));
  } catch (e) {
    return new Response(
      JSON.stringify({
        statusText: "Database not found",
      }),
      { status: 400 }
    );
  }

  const taskBoard: TaskBoard = DefaultTaskBoardWithGroupInfos(groupInfos);
  FillTaskBoard(taskBoard, tasks, data.all_posts || false);
  return new Response(TaskBoardToResponseBody(taskBoard), { status: 200 });
}
