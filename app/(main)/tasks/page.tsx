import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchServerAPIRequest } from "@/lib/server-utils";
import { StatusLabel } from "./_components/status-label";
import { TaskCard } from "./_components/task-card";
import { Task } from "@/lib/types";

type statusListObj = {
  toDo: Task[],
  inProgress: Task[],
  completed: Task[],
  backlog: Task[]
}


function getTasks() {
  // const res = await fetchServerAPIRequest('/api/v1/tasks', 'GET');
  // if (res.status === 401)
  //   return { error: "You don't have permission to view this page." };
  // // throw new Error("You don't have permission to view this page.");

  // const data = await res.json();
  // return data;
  
  const tasks = [
    {
      "id": 'string',
      "project_id": 'string',
      "name": 'Task 1',
      "creator_id": 'string',
      "parent_task_id": 'string',
      "status": 'To Do',
      "description": 'Start of first task',
      "deadline": '12/12/2024',
      "weighting": 1,
      "priority": 'High',
      "attachment": 'string',
      "member_count": 1,
    },
    {
      "id": 'string',
      "project_id": 'string',
      "name": 'string',
      "creator_id": 'string',
      "parent_task_id": 'string',
      "status": 'In Progress',
      "description": 'string',
      "deadline": '12/12/2024',
      "weighting": 1,
      "priority": 'Medium',
      "attachment": 'string',
      "member_count": 1,
    },
    {
      "id": 'string',
      "project_id": 'string',
      "name": 'string',
      "creator_id": 'string',
      "parent_task_id": 'string',
      "status": 'Completed',
      "description": 'string',
      "deadline": '12/12/2024',
      "weighting": 1,
      "priority": 'Low',
      "attachment": 'string',
      "member_count": 1,
    },
    {
      "id": 'string',
      "project_id": 'string',
      "name": 'string',
      "creator_id": 'string',
      "parent_task_id": 'string',
      "status": 'Backlog',
      "description": 'string',
      "deadline": '12/12/2024',
      "weighting": 1,
      "priority": 'Low',
      "attachment": 'string',
      "member_count": 1,
    },
  ];
  
  const taskStatusObject : statusListObj = {
    toDo: [],
    inProgress: [],
    completed: [],
    backlog: []
  }

  for (const task of tasks) {
    if (task.status === 'To Do') {
      taskStatusObject["toDo"].push(task);
    } else if (task.status === 'In Progress') {
      taskStatusObject["inProgress"].push(task);
    } else if (task.status === 'Completed') {
      taskStatusObject["completed"].push(task);
    } else {
      taskStatusObject["backlog"].push(task);
    }
  }
  return taskStatusObject; 
}

export default async function TasksPage() {
  const projectTasks = getTasks();
  
  return (
    <div className="h-screen flex flex-col px-8 pt-8 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold tracking-tight">My Tasks</h2>
      </div>
      <Card className="w-full flex flex-col h-full sm:max-h-full overflow-auto rounded-b-none bg-slate-100">
        <div className="grid lg:grid-cols-4 lg:grid-rows-1 sm:grid-cols-2 sm:grid-rows-2 space-y-5 sm:space-y-0 gap-5 pt-5">

          <div className="flex flex-col gap-2 items-center col-span-1 row-span-1 min-h-[250px] pb-3">
            <StatusLabel variant="backlog" statusText="Backlog"/>
            {projectTasks["backlog"].map((task, index) => (
              <TaskCard key={index} item={task} />
            ))}

          </div>
          <div className="flex flex-col gap-2 items-center col-span-1 row-span-1 min-h-[250px] pb-3">
            <StatusLabel statusText="To Do"/>
            {projectTasks["toDo"].map((task, index) => (
              <TaskCard key={index} item={task} />
            ))}
          </div>
          <div className="flex flex-col gap-2 items-center col-span-1 row-span-1 min-h-[250px] pb-3">
            <StatusLabel variant="inprogress" statusText="In Progress"/>
            {projectTasks["inProgress"].map((task, index) => (
              <TaskCard key={index} item={task} />
            ))}
            
          </div>
          <div className="flex flex-col gap-2 items-center col-span-1 row-span-1 min-h-[250px] pb-3">
            <StatusLabel variant="completed" statusText="Completed"/>
            {projectTasks["completed"].map((task, index) => (
              <TaskCard key={index} item={task} />
            ))}

          </div>
        </div>
      </Card>
    </div>
  );
}
