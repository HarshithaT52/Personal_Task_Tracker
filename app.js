const taskForm = document.getElementById("task-form");
const taskNameInput = document.getElementById("task-name");
const taskPriorityInput = document.getElementById("task-priority");
const taskDateInput = document.getElementById("task-date"); // New date input
const taskList = document.getElementById("task-list");
const filterDate = document.getElementById("filter-date"); // Date filter
const filterStatus = document.getElementById("filter-status"); // Status filter
const filterPriority = document.getElementById("filter-priority"); // Priority filter
const totalTasksEl = document.getElementById("total-tasks");
const completedTasksEl = document.getElementById("completed-tasks");
const pendingTasksEl = document.getElementById("pending-tasks");
const noTasksMessage = document.getElementById("no-tasks-message"); // Message for no tasks found


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateSummary() {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === "completed").length;
  const pendingTasks = totalTasks - completedTasks;

  totalTasksEl.textContent = totalTasks;
  completedTasksEl.textContent = completedTasks;
  pendingTasksEl.textContent = pendingTasks;
}


function renderTasks() {
  taskList.innerHTML = ""; // Clear the task list before rendering
  noTasksMessage.style.display = "none"; // Hide "No tasks found" message by default

 
  const selectedDate = filterDate.value;
  const selectedStatus = filterStatus.value;
  const selectedPriority = filterPriority.value;

  const filteredTasks = tasks.filter(task => {
  
    if (selectedDate && task.date !== selectedDate) return false;


    if (selectedStatus !== "all" && task.status !== selectedStatus) return false;

    if (selectedPriority !== "all" && task.priority !== selectedPriority) return false;

    return true; // Include task if all filters match
  });

  if (filteredTasks.length === 0) {
    noTasksMessage.style.display = "block"; // Display "No tasks found" message
  } else {
    filteredTasks.forEach((task, index) => {
      const taskEl = document.createElement("div");
      taskEl.className = `list-group-item d-flex justify-content-between align-items-center ${
        task.status === "completed" ? "completed-task" :
        task.status === "pending" ? "pending-task" : ""
      } ${
        task.priority === "high" ? "high-priority" :
        task.priority === "medium" ? "medium-priority" : "low-priority"
      }`;

      taskEl.innerHTML = ` 
        <span>
          <input type="checkbox" ${task.status === "completed" ? "checked" : ""} 
          class="me-2 toggle-status" data-index="${index}">
          ${task.name} (Due: ${task.date})
        </span>
        <div>
          <button class="btn btn-sm btn-danger delete-task" data-index="${index}">Delete</button>
        </div>
      `;
      taskList.appendChild(taskEl); 
    });
  }

  updateSummary(); }

taskForm.addEventListener("submit", e => {
  e.preventDefault();

  const newTask = {
    name: taskNameInput.value,
    priority: taskPriorityInput.value,
    date: taskDateInput.value,  
    status: "pending",  
  };

  tasks.push(newTask); 
  saveTasks(); 
  renderTasks(); 
  taskForm.reset();
});

filterDate.addEventListener("change", renderTasks);
filterStatus.addEventListener("change", renderTasks);
filterPriority.addEventListener("change", renderTasks);

taskList.addEventListener("click", e => {
  const index = e.target.dataset.index;

  if (e.target.classList.contains("delete-task")) {
    tasks.splice(index, 1); // Remove task from the array
  } else if (e.target.classList.contains("toggle-status")) {
    // Toggle the task status between 'pending' and 'completed'
    tasks[index].status = e.target.checked ? "completed" : "pending";
  }

  saveTasks(); 
  renderTasks(); 
});


renderTasks();
