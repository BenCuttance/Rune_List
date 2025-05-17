let taskTitle = document.getElementById("taskTitle_input");
let skillCheckbox = document.getElementById("skill");
let taskCheckbox = document.getElementById("task");
let tasks = document.getElementById("taskList");
import { runescapeSkills } from "./CONSTS.js";

let storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
let completedTasks = [];

// const appendTaskToList = (string) => {
//     const btn = document.createElement('button')
//     const li = document.createElement('li')
//     li.textContent = string

//     btn.classList.add("task_options")
//     btn.addEventListener("click", () => {
//         taskOptions()
//     })

//     btn.appendChild(li)
//     tasks.append(btn)

// //   const li = document.createElement("li");
// //   li.textContent = string;
// //   li.classList.add("task_format");

// //   const deleteButton = document.createElement("button");
// //   deleteButton.textContent = "x";
// //   deleteButton.classList.add("delete_button");

// //   deleteButton.addEventListener("click", () => {
// //     li.remove();

// //     storedTasks = storedTasks.filter((task) => task.title !== string);
// //     localStorage.setItem("tasks", JSON.stringify(storedTasks));
// //   });

// //   li.appendChild(deleteButton);
// //   tasks.appendChild(li);
// };

const appendTaskToList = (string) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("task_wrapper");

  // Create the task button
  const btn = document.createElement("button");
  btn.classList.add("task_options");
  btn.textContent = "•  " + string;

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
  tasks.appendChild(wrapper);

  const strikeBtn = dropdown.querySelector("#strike_btn");
  strikeBtn.addEventListener("click", () => {
    btn.style.textDecoration =
      btn.style.textDecoration === "line-through" ? "none" : "line-through";
  });

  const completedBtn = dropdown.querySelector(".completed_btn");
  completedBtn.addEventListener("click", () => {
    // Find the actual task you're completing
    const completedTask = storedTasks.find((task) => task.title === string);

    if (completedTask) {
      // Add to completed list
      completedTasks.push(completedTask);

      // Remove it from current task list
      storedTasks = storedTasks.filter((task) => task.title !== string);

      // Save both
      localStorage.setItem("tasks", JSON.stringify(storedTasks));
      localStorage.setItem("completed", JSON.stringify(completedTasks));

      console.log("Completed:", completedTasks);

      // Remove from DOM
      wrapper.remove();
    }
  });

  const deleteBtn = dropdown.querySelector(".delete_btn")
  deleteBtn.addEventListener("click", () => {
    const filterDeletedTask = storedTasks.find((task) => task.title !== string)

    localStorage.setItem("tasks", JSON.stringify(filterDeletedTask))

    wrapper.remove()
  })

  btn.addEventListener("click", () => {
    dropdown.style.display =
      dropdown.style.display === "none" ? "block" : "none";
    taskOptions();
  });
};

const renderStoredTasks = () => {
  storedTasks.forEach((task) => {
    appendTaskToList(task.title);
  });
};

const submitTask = (e) => {
  //   e.preventDefault();

  const userInput = taskTitle.value;

  const selectedRadio = document.querySelector(
    'input[name="taskType"]:checked'
  );

  if (!validateInput()) return;

  const taskType = selectedRadio ? selectedRadio.value : "task";

  let matchedInput = skillSearch(userInput);
  let newString = `${matchedInput} ${taskTitle.value} (${taskType})`;
  console.log(matchedInput);

  appendTaskToList(newString);

  storedTasks.push({
    title: newString,
    taskType: taskType,
    id: storedTasks.length + 1,
  });

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

  taskTitle.value = "";
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

const taskOptions = () => {
  console.log("CLICKED");
};

const removeFromList = () => {};

const strikeThrough = () => {
  console.log(this.textContent);
  this.style.textDecoration = "line-through";
};

const moveToCompleted = () => {};

renderStoredTasks();

document.getElementById("submit_button").addEventListener("click", submitTask);
document.querySelector(".task_options").addEventListener("click", taskOptions);
