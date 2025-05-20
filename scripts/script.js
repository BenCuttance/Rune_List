let taskTitle = document.getElementById("taskTitle_input");
let tasks = document.getElementById("taskList");
let completedList = document.getElementById("completedList");
let subTask = document.getElementById("subTask");
let displaySubTasks = document.getElementById('displaySubTasks')
let addSubTaskBtn = document.getElementById('addSubTask')
import { runescapeSkills } from "../CONSTS.js";

let storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
let completedTasks = JSON.parse(localStorage.getItem("completed")) || [];
let currentSubTasks = []

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

const appendTaskToList = (string) => {
  createTaskButtons(string, "task");
};

const appendTaskToCompleted = (string) => {
  createTaskButtons(string, "completed");
};

const createTaskButtons = (string, listType) => {
  let divSection;
  const wrapper = document.createElement("div");
  wrapper.classList.add("task_wrapper");

  // Create the task button
  const btn = document.createElement("button");
  btn.classList.add("task_options");
  btn.textContent = "•  " + string;

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
    case "completed":
      dropdown.innerHTML = `
        <button class="dropdown_action" id="strike_btn">Strike through</button>
        <button class="dropdown_action delete_btn ">Delete</button>
      `;
      divSection = completedList;
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

  const strikeBtn = dropdown.querySelector("#strike_btn");
  if (strikeBtn) {
    strikeBtn.addEventListener("click", () => {
      btn.style.textDecoration =
        btn.style.textDecoration === "line-through" ? "none" : "line-through";
    });
  }

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

  const deleteBtn = dropdown.querySelector(".delete_btn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      let listToUpdate =
        listType === "completed" ? completedTasks : storedTasks;

      listToUpdate = listToUpdate.filter((task) => task.title !== string);

      if (listType === "completed") {
        completedTasks = listToUpdate;
        localStorage.setItem("completed", JSON.stringify(completedTasks));
      } else {
        storedTasks = listToUpdate;
        localStorage.setItem("tasks", JSON.stringify(storedTasks));
      }

      wrapper.remove();
      console.log("deleted")
    });
  }

  btn.addEventListener("click", () => {
    dropdown.style.display =
      dropdown.style.display === "none" ? "block" : "none";
  });
};

const renderStoredTasks = () => {
  storedTasks.forEach((task) => {
    appendTaskToList(task.title);
  });
};

const renderCompletedTasks = () => {
  completedTasks.forEach((task) => {
    appendTaskToCompleted(task.title);
  });
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
  console.log("BEFORE: ", currentSubTasks)
  storedTasks.push({
    title: newString,
    subTasks: [...currentSubTasks],
    taskType: taskType,
    id: Date.now(),
  });
  currentSubTasks = []
  console.log("AFTER: ", currentSubTasks)
  appendTaskToList(newString);



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


const addSubTask = () => {
    if (subTask.value !== ""){
    createTaskButtons(subTask.value, "subTask")
    currentSubTasks.push(subTask.value)
    subTask.value = ""
    }
console.log(currentSubTasks)
}

document.getElementById("submit_button").addEventListener("click", submitTask);

document.getElementById("input_form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

document.getElementById("addSubTask").addEventListener("click", (e) => {
    e.preventDefault();
    addSubTask()
  });

renderStoredTasks();
renderCompletedTasks();
