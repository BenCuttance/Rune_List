let taskTitle = document.getElementById("taskTitle_input");
let tasks = document.getElementById("taskList");
let completedList = document.getElementById("completedList");
let subTask = document.getElementById("subTask");

let displaySubTasks = document.getElementById("displaySubTasks");
let addSubTaskBtn = document.getElementById("addSubTask");
import { runescapeSkills } from "../CONSTS.js";
import { strikeThroughButton, deleteButton } from "./createTasks.js";

let storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

//TODO: Back to local storage
let completedTasks =
  // JSON.parse(localStorage.getItem("completed")) ||
  [
    {
      title: "Test Task",
      subTasks: ["Sub 1", "Sub 2"],
      taskType: "Task",
      id: Date.now(),
    },
  ];
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


const getTaskID = () => {

}

const createTaskButtons = (taskObject, listType) => {

  let divSection;
  const wrapper = document.createElement("div");
  wrapper.classList.add("task_wrapper");
  wrapper.id = taskObject.id


  // Create the task button
  const btn = document.createElement("button");
  btn.classList.add("task_options");

  btn.textContent = "•  " + taskObject.title;


  // Create the dropdown menu
  const dropdown = document.createElement("div");
  dropdown.classList.add("task_dropdown");
  switch (listType) {
    case "task":
      dropdown.innerHTML = `
        <button class="dropdown_action" id="edit_btn">Edit</button>
        <button class="dropdown_action" id="strike_btn">Strike through</button>
        <button class="dropdown_action completed_btn" id="completed_btn">Completed</button>
        <button class="dropdown_action delete_btn ">Delete</button>
      `;
      divSection = tasks;
      break;
    case "subTask":
      dropdown.innerHTML = `
          <button type="button" class="dropdown_action" id="strike_btn">Strike through</button>
          <button type="button" class="dropdown_action delete_btn">Delete</button>
        `;
      divSection = displaySubTasks;
      break;

    default:
      console.log("Unknown task type");
  }

  dropdown.style.display = "none";

  wrapper.appendChild(btn);
  wrapper.appendChild(dropdown);
  divSection.appendChild(wrapper);

  // STRIKETHROUGH BUTTON
  strikeThroughButton(dropdown, btn)

  // DELETE BUTTON
  deleteButton(dropdown, wrapper, "tasks", storedTasks)

  const completedBtn = dropdown.querySelector(".completed_btn");
  if (completedBtn) {
    completedBtn.addEventListener("click", () => {
      const completedTask = storedTasks.find((task) => task.title === string);

      if (completedTask) {
        completedTasks.push(completedTask);

        storedTasks = storedTasks.filter(
          (task) => task.id !== completedTask.id
        );

        console.log(completedTask);
        localStorage.setItem("tasks", JSON.stringify(storedTasks));
        localStorage.setItem("completed", JSON.stringify(completedTasks));

        appendTaskToCompleted(completedTask.title);
        wrapper.remove();
      }
    });
  }

  btn.addEventListener("click", () => {
    dropdown.style.display =

    dropdown.style.display === "none" ? "block" : "none";
  });
};

const addTaskToCompleted = (input) => {
  const divSection = document.getElementById("completed_section");

  // Normalize to array if it's a single object
  const tasks = Array.isArray(input) ? input : [input];

  tasks.forEach((task) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("task_wrapper");

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
    `;

    dropdown.style.display = "none";
    wrapper.appendChild(btn);

    btn.addEventListener("click", () => {
      dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
    });

    wrapper.appendChild(dropdown);
    divSection.appendChild(wrapper);

    strikeThroughButton(dropdown, btn);
    deleteButton(dropdown, wrapper, "completed", completedTasks)

  });
};

// EDIT BUTTON


// COMPLETED BUTTON



const renderStoredTasks = () => {
  storedTasks.forEach((task) => {
    // appendTaskToList(task.title);
    createTaskButtons(task, "task")

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
  }
  storedTasks.push(newTaskObject);
  currentSubTasks = [];
  console.log("AFTER: ", currentSubTasks);
  // appendTaskToList(newTaskObject);
  createTaskButtons(newTaskObject, "task")


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


// TODO: ADDS SUBTASK TO DIV AND CONSOLE LOGS FOR NOW WILL NEED TO FIX
const addSubTask = () => {
  if (subTask.value !== "") {
    createTaskButtons(subTask.value, "subTask");
    currentSubTasks.push(subTask.value);
    subTask.value = "";
  }
  console.log(currentSubTasks);
};


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
