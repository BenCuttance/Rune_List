let taskTitle = document.getElementById("taskTitle_input");
let tasks = document.getElementById("taskList");
let completedList = document.getElementById("completedList");
let subTask = document.getElementById("subTask");

let subTaskDiv = document.getElementById("displaySubTasks");
let addSubTaskBtn = document.getElementById("addSubTask");
import { runescapeSkills } from "../CONSTS.js";
import {
  strikeThroughButton,
  deleteButton,
  completedButton,
  editButton,
  displaySubTasks,
} from "./createTasks.js";

let storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

//TODO: Back to local storage
let completedTasks = JSON.parse(localStorage.getItem("completed")) || [];

console.log(completedTasks);
let currentSubTasks = [];

window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("sw.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  }
});

// const appendTaskToList = (newTaskObject) => {
//   createTaskButtons(newTaskObject, "task");
// };

//TODO: delete?
// const appendTaskToCompleted = (string) => {
//   createTaskButtons(string, "completed");
// };

const createTaskButtons = (taskObject) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("task_wrapper");
  wrapper.id = taskObject.id;

  // Create the task button
  const btn = document.createElement("button");
  btn.classList.add("task_options");

  btn.textContent = "•  " + taskObject.title;

  // Create the dropdown menu
  const dropdown = document.createElement("div");
  dropdown.classList.add("task_dropdown");
  dropdown.innerHTML = `
        <button class="dropdown_action" id="edit_btn">Edit</button>
        <button class="dropdown_action" id="strike_btn">Strike through</button>
        <button class="dropdown_action completed_btn" id="completed_btn">Completed</button>
        <button class="dropdown_action delete_btn ">Delete</button>
      `;

  dropdown.style.display = "none";

  wrapper.appendChild(btn);
  wrapper.appendChild(dropdown);

  // ADD SUBTASKS
  displaySubTasks(wrapper, taskObject);

  tasks.appendChild(wrapper);

  // STRIKETHROUGH BUTTON
  strikeThroughButton(dropdown, btn);

  // DELETE BUTTON
  deleteButton(dropdown, wrapper, "tasks", storedTasks);

  // COMPELTED BUTTON
  completedButton(dropdown, wrapper, storedTasks, completedTasks);

  // EDIT BUTTON
  editButton(dropdown, wrapper, storedTasks);

  btn.addEventListener("click", () => {
    dropdown.style.display =
      dropdown.style.display === "none" ? "block" : "none";
  });
};

// TODO: ADDS SUBTASK TO DIV AND CONSOLE LOGS FOR NOW WILL NEED TO FIX
const addSubTask = () => {
  const li = document.createElement("li");

  if (subTask.value !== "") {
    currentSubTasks.push({ subTask: subTask.value, striked: false });
    li.textContent = subTask.value;
    subTaskDiv.appendChild(li);
    subTask.value = "";
  }
  console.log(currentSubTasks);
};

const addTaskToCompleted = (input) => {
  const divSection = document.getElementById("completed_section");

  // Normalize to array if it's a single object
  const tasks = Array.isArray(input) ? input : [input];

  tasks.forEach((task) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("task_wrapper");
    wrapper.id = task.id;

    // Create the task button
    const btn = document.createElement("button");
    btn.classList.add("task_options");
    btn.textContent = "•  " + task.title;

    // Create the dropdown menu
    const dropdown = document.createElement("div");
    dropdown.classList.add("task_dropdown");

    dropdown.innerHTML = `
      <button class="dropdown_action" id="strike_btn">Strike through</button>
      <button class="dropdown_action delete_btn">Delete</button>
      <button class="dropdown_action completed_btn"  id="completed_btn"> Move</button>
    `;

    dropdown.style.display = "none";
    wrapper.appendChild(btn);

    btn.addEventListener("click", () => {
      dropdown.style.display =
        dropdown.style.display === "none" ? "block" : "none";
    });

    wrapper.appendChild(dropdown);
    divSection.appendChild(wrapper);

    strikeThroughButton(dropdown, btn);
    deleteButton(dropdown, wrapper, "completed", completedTasks);
    completedButton(
      dropdown,
      wrapper,
      completedTasks,
      storedTasks,
      "Move completed to tasks"
    );
  });
};

const renderStoredTasks = () => {
  storedTasks.forEach((task) => {
    createTaskButtons(task);
  });
};

const renderCompletedTasks = () => {
  addTaskToCompleted(completedTasks);
};

const submitTask = (e) => {
  const userInput = taskTitle.value;

  const selectedRadio = document.querySelector(
    'input[name="taskType"]:checked'
  );

  if (!validateInput()) return;

  const taskType = selectedRadio ? selectedRadio.value : "task";

  let matchedInput = skillSearch(userInput);
  let newString = `${matchedInput} ${taskTitle.value} (${taskType})`;
  console.log(matchedInput);

  console.log("BEFORE: ", currentSubTasks);

  let newTaskObject = {
    title: newString,
    subTasks: [...currentSubTasks],
    taskType: taskType,
    id: Date.now(),
  };
  storedTasks.push(newTaskObject);
  currentSubTasks = [];
  console.log("AFTER: ", currentSubTasks);
  // appendTaskToList(newTaskObject);
  createTaskButtons(newTaskObject);

  console.log(storedTasks);

  localStorage.setItem("tasks", JSON.stringify(storedTasks));
  clearForm();
};

const validateInput = () => {
  if (taskTitle.value === "") {
    taskTitle.focus();
    return false;
  }

  return true;
};

const clearForm = () => {
  const selectedRadio = document.querySelector(
    'input[name="taskType"]:checked'
  );

  document.getElementById("displaySubTasks").innerHTML = "";
  taskTitle.value = "";
  subTask.value = "";
  if (selectedRadio) selectedRadio.checked = false;
};

const skillSearch = (sentence) => {
  let sentenceArray = [];

  const wordsArray = sentence
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(" ")
    .filter(Boolean);
  sentenceArray.push(wordsArray);

  // Filter out all matching skills
  const matchedSkills = wordsArray
    .map((word) => findSkillByName(word))
    .filter((skill) => skill !== undefined);

  return matchedSkills;
};

const findSkillByName = (name) => {
  const matchedSkill = runescapeSkills.find(
    (skill) => skill.skillName.toLowerCase() === name.toLowerCase()
  );

  if (matchedSkill) return matchedSkill.skillEmoji;
};

const hideSection = (toHideId, toShowId) => {
  const hide = document.getElementById(toHideId);
  const show = document.getElementById(toShowId);

  if (hide) hide.style.display = "none";
  if (show) show.style.display = "flex";
};

// input_section document selectors (Section 1)
document.querySelector(".input_drop_down").addEventListener("click", () => {
  hideSection("input_section", "input_hidden");
});

document
  .querySelector(".input_drop_down_hidden")
  .addEventListener("click", () => {
    hideSection("input_hidden", "input_section");
  });

// task_section document selectors (Section 2)
document.querySelector(".task_drop_down").addEventListener("click", () => {
  hideSection("task_section", "task_hidden");
});

document
  .querySelector(".task_drop_down_hidden")
  .addEventListener("click", () => {
    hideSection("task_hidden", "task_section");
  });

// completed_section document selectors (Section 3)
document.querySelector(".completed_drop_down").addEventListener("click", () => {
  hideSection("completed_section", "completed_hidden");
});

document
  .querySelector(".completed_drop_down_hidden")
  .addEventListener("click", () => {
    hideSection("completed_hidden", "completed_section");
  });

document.getElementById("submit_button").addEventListener("click", submitTask);

document.getElementById("input_form").addEventListener("submit", (e) => {
  e.preventDefault();
});

document.getElementById("addSubTask").addEventListener("click", (e) => {
  e.preventDefault();
  addSubTask();
});

renderStoredTasks();
renderCompletedTasks();

export { addTaskToCompleted, createTaskButtons };
