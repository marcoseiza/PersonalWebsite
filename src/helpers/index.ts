import type { MDInstance } from "./types";

export type Module<T> = () => Promise<T>;

export const fetchPostImportModules = () => {
  return Object.values(import.meta.glob("../posts/*.md") as any) as Module<MDInstance>[];
}

export const updatePostUrl = (post: MDInstance): MDInstance => ({
  ...post,
  url: `/posts/${post.frontmatter.slug}`
})

export const isValidPost = (post: MDInstance) => 
  !post.frontmatter.draft && !post.frontmatter.archive;

export const postFilter = (post: MDInstance) : MDInstance | [] => 
  (!post.frontmatter.draft && !post.frontmatter.archive) ? post : [];


export const postComparator = (a: MDInstance, b: MDInstance) =>
  new Date(b.frontmatter.date).getTime() -
  new Date(a.frontmatter.date).getTime();

export const sortPosts = (posts: MDInstance[]) => posts.sort(postComparator);

export const filterAndSortPosts = (posts: MDInstance[]) : MDInstance[] => 
  sortPosts(posts.filter(isValidPost))

export type TaskGroupId = string;
export interface TaskGroupInfo { id: TaskGroupId; name: string; color: string; }
export type Task = { groupId: TaskGroupId, name: string; }
export type TaskGroup = { groupInfo: TaskGroupInfo, tasks: Task[] };
export type TaskBoard = Map<string, TaskGroup>;
export type QueryDatabaseResponse = { results: QueryTaskDBEntry[] };
export interface QueryTaskDBEntry {
  properties: {
    Status: { select: TaskGroupInfo; };
    Name: { title: { text: { content: string } }[]; };
  };
}
export interface GetDatabaseResponse { 
  properties: { Status: { select: { options: TaskGroupInfo[]; } } }
}

export const DefaultTaskGroup = (groupInfo: TaskGroupInfo) : TaskGroup => ({
  groupInfo, tasks: []
});
export const DefaultTaskBoard = (numOfGroups: number) : TaskBoard => 
  new Map<TaskGroupId, TaskGroup>(new Array(numOfGroups).fill(undefined).map((v, i) => [i.toString(), v]));
export const DefaultTaskBoardWithGroupInfos = (groupInfos: TaskGroupInfo[]) : TaskBoard => 
  new Map<TaskGroupId, TaskGroup>(groupInfos.map(info => [info.id, DefaultTaskGroup(info)]))
export const FillTaskBoard = (board: TaskBoard, tasks: Task[]) => {
  tasks.forEach((task) => {
    const prevGroup = board.get(task.groupId);
    prevGroup && board.set(task.groupId, {
      ...prevGroup,
      tasks: prevGroup.tasks.concat(task)
    });
  });
}
export const TaskBoardToResponseBody = (board: TaskBoard): string => 
  JSON.stringify({ board: JSON.stringify(Array.from(board)) });
export const ResponseJsonToTaskBoard = (json: any): TaskBoard => 
  new Map<TaskGroupId, TaskGroup>(JSON.parse(json.board));

export const parseTasks = (db: QueryDatabaseResponse) : Task[] => {
  const taskEntries: QueryTaskDBEntry[] = db.results.slice(0, -1);
  return taskEntries.map(v => ({
    groupId: v.properties.Status.select.id,
    name: v.properties.Name.title[0].text.content
  }));
};
export const parseGroups = (db: GetDatabaseResponse) : TaskGroupInfo[] => (
  db.properties.Status.select.options
)
