import { Client } from "@notionhq/client";
import { Tasks, TaskDBEntry, DefaultTasks } from "../helpers";

export async function post({ request }: any) {
  const data = await request.json();

  if (data.database_id === undefined) {
    return new Response(JSON.stringify({ 
      statusText: '"database_id" not defined in request body'
    }), { status: 400});
  }
  
  const notion = new Client({ auth: import.meta.env.NOTION_SECRET })
  const tasks: Tasks = DefaultTasks();
  
  try {
    const tasksDB = (await notion.databases.query({ 
      database_id: data.database_id 
    })) as unknown as { results: TaskDBEntry[] };
    
    tasksDB.results.slice(0, -1).map((v: TaskDBEntry) => {
      tasks[v.properties.Status.select.name].push(
        v.properties.Name.title[0].text.content
      );
    });
  } catch (e) {
    return new Response(JSON.stringify({ 
      statusText: 'Database not found'
    }), { status: 400});
  }

  return new Response(JSON.stringify({ tasks }), { status: 200 });
}
