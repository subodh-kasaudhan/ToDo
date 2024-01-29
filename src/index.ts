import { v4 as uuidV4 } from "uuid";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};
const list = document.querySelector<HTMLUListElement>("#list");
const form = document.getElementById("new-task-form") as HTMLFormElement | null;
const input = document.querySelector<HTMLInputElement>("#new-task-title");
const deleteButton = document.getElementById(
  "delete-checked"
) as HTMLButtonElement;
const selectAll = document.getElementById("check-all") as HTMLButtonElement;
var checkState = false;
var tasks: Task[] = loadTasks();
tasks.forEach(addListItem);

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input?.value == "" || input?.value == null) return;

  const newTask: Task = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date(),
  };
  tasks.push(newTask);
  saveTasks();
  addListItem(newTask);
  input.value = "";
});

deleteButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  refreshList();
});

selectAll.addEventListener("click", () => {
  if (!checkState) tasks.forEach((task) => (task.completed = true));
  else tasks.forEach((task) => (task.completed = false));
  checkState = !checkState;
  saveTasks();
  refreshList();
});

function addListItem(task: Task) {
  const item = document.createElement("li");
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    saveTasks();
  });
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  label.append(checkbox, task.title);
  item.append(label);
  list?.append(item);
}

function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(tasks));
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem("TASKS");
  if (taskJSON == null) return [];
  return JSON.parse(taskJSON);
}

function refreshList() {
  // Clear the current list
  if (list !== null) {
    list.innerHTML = "";
  }

  // Re-add all tasks to the list
  tasks.forEach(addListItem);
}
