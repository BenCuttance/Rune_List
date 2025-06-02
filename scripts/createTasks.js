import {
  addTaskToCompleted,
  createTaskButtons,
  storedTasks,
  completedTasks,
} from "./script.js";

const strikeThroughButton = (dropdown, btn, object, list, listType) => {
  const strikeBtn = dropdown.querySelector("#strike_btn");
  if (strikeBtn) {
    strikeBtn.addEventListener("click", () => {
      object.striked = !object.striked;
      btn.style.textDecoration = object.striked ? "line-through" : "none";
      const storageKey = listType === "completed" ? "completed" : "tasks";
      localStorage.setItem(storageKey, JSON.stringify(list));
    });
  }
};

const checkIsStriked = (btn, taskObject) => {
  btn.style.textDecoration = taskObject.striked ? "line-through" : "none";
};

const strikeThroughSubTasksButton = (dropdown, wrapper) => {
  const strikeBtn = dropdown.querySelector("#strike_btn");

  if (strikeBtn) {
    strikeBtn.addEventListener("click", () => {
      const subTaskId = wrapper.id;
      const parentList = wrapper.closest("[data-list-type]");

      if (!parentList) {
        console.warn("Could not find parent with data-list-type");
        return;
      }

      const listType = parentList.dataset.listType;
      const storageKey = listType;
      let storageList;

      if (listType === "tasks") {
        storageList = storedTasks;
      } else if (listType === "completed") {
        storageList = completedTasks;
      } else {
        console.warn(`Unrecognized list type: ${listType}`);
        return;
      }

      storageList.forEach((task) => {
        if (Array.isArray(task.subTasks)) {
          task.subTasks.forEach((subTask) => {
            if (subTask.subTaskID === subTaskId) {
              subTask.striked = !subTask.striked;

              const btn = wrapper.querySelector(".sub_task_btn");
              if (btn) {
                btn.style.textDecoration = subTask.striked
                  ? "line-through"
                  : "none";
              }
            }
          });
        }
      });

      localStorage.setItem(storageKey, JSON.stringify(storageList));
      console.log(`Toggled strike for subtask ${subTaskId} in ${storageKey}`);
    });
  }
};

const deleteButton = (dropdown, wrapper, listType, list) => {
  const deleteBtn = dropdown.querySelector(".delete_btn");

  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      const taskId = Number(wrapper.id);

      const storageKey = listType === "completed" ? "completed" : "tasks";

      const updatedList = list.filter((task) => task.id !== taskId);
      list.length = 0;
      list.push(...updatedList);

      localStorage.setItem(storageKey, JSON.stringify(updatedList));
      wrapper.remove();
      console.log(`Deleted task ${taskId} from ${storageKey}`);
    });
  }
};

const deleteSubTasksButton = (dropdown, wrapper, listType, list) => {
  const deleteBtn = dropdown.querySelector(".delete_btn");

  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      const subTaskId = wrapper.id;

      const storageKey = listType === "completed" ? "completed" : "tasks";

      list.forEach((task) => {
        if (Array.isArray(task.subTasks)) {
          task.subTasks = task.subTasks.filter(
            (subTask) => subTask.subTaskID !== subTaskId
          );
        }
      });

      localStorage.setItem(storageKey, JSON.stringify(list));

      wrapper.remove();

      console.log(`Deleted subtask ${subTaskId} from ${storageKey}`);
    });
  }
};

const completedButton = (
  dropdown,
  wrapper,
  startingArray,
  endingArray,
  listType = "completed"
) => {
  const completedBtn = dropdown.querySelector(".completed_btn");

  if (completedBtn) {
    completedBtn.addEventListener("click", () => {
      let startingArrayStorage;
      let endingArrayStorage;

      const taskId = Number(wrapper.id);

      const task = startingArray.find((task) => task.id === taskId);

      if (task) {
        const updatedStart = startingArray.filter((t) => t.id !== taskId);
        startingArray.length = 0;
        startingArray.push(...updatedStart);

        endingArray.push(task);

        if (listType === "completed") {
          addTaskToCompleted(task);
          startingArrayStorage = "tasks";
          endingArrayStorage = "completed";
        } else {
          createTaskButtons(task);
          startingArrayStorage = "completed";
          endingArrayStorage = "tasks";
        }

        localStorage.setItem(
          startingArrayStorage,
          JSON.stringify(startingArray)
        );
        localStorage.setItem(endingArrayStorage, JSON.stringify(endingArray));

        wrapper.remove(); 
      } else {
        console.log("NOT FOUND");
      }
    });
  }
};

const editButton = (dropdown, wrapper, array) => {
  const editBtn = dropdown.querySelector("#edit_btn");

  const taskId = Number(wrapper.id);

  const task = array.find((task) => task.id === taskId);
  if (editBtn && task) {
    editBtn.addEventListener("click", () => {
      const newTitle = prompt("Edit task value", task.title);

      if (newTitle !== null && newTitle.trim() !== "") {
        task.title = newTitle.trim();
        localStorage.setItem("tasks", JSON.stringify(array));
      }

      const btn = wrapper.querySelector(".task_options");
      if (btn) btn.textContent = "•  " + task.title;
    });
  }
};

const displaySubTasks = (wrapper, taskObject) => {
  taskObject.subTasks.forEach((element) => {
    const subWrapper = document.createElement("div");
    subWrapper.classList.add("task_wrapper");
    subWrapper.id = element.subTaskID;

    const dropdown = document.createElement("div");
    dropdown.classList.add("task_dropdown");

    const btn = document.createElement("button");
    btn.textContent = "• " + element.subTask;
    btn.classList.add("sub_task_btn");

    dropdown.innerHTML = `
      <button class="dropdown_action" id="strike_btn">Strike through</button>
      <button class="dropdown_action delete_btn">Delete</button>
    `;

    dropdown.style.display = "none";

    subWrapper.appendChild(btn);

    btn.addEventListener("click", (event) => {
      event.stopPropagation();

      dropdown.style.display =
        dropdown.style.display === "block" ? "none" : "block";

      if (dropdown.style.display === "block") {
        const handleClickOutside = (e) => {
          if (!dropdown.contains(e.target) && e.target !== btn) {
            dropdown.style.display = "none";
            document.removeEventListener("click", handleClickOutside);
          }
        };

        document.addEventListener("click", handleClickOutside);
      }
    });

    subWrapper.appendChild(dropdown);
    wrapper.appendChild(subWrapper);

    deleteSubTasksButton(dropdown, subWrapper, "tasks", storedTasks);
    strikeThroughSubTasksButton(dropdown, subWrapper, "tasks", storedTasks);

    checkIsStriked(btn, element);
  });
};

export {
  strikeThroughButton,
  deleteButton,
  completedButton,
  editButton,
  displaySubTasks,
  checkIsStriked,
};
