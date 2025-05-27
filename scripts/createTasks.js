import { addTaskToCompleted, createTaskButtons } from "./script.js";

// STRIKETHROUGH BUTTON
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
  console.log("IS IS STRIKED THO??", taskObject.striked);

  btn.style.textDecoration = taskObject.striked ? "line-through" : "none";
};

// DELETE BUTTON
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

// COMPLETED BUTTON
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
        // Remove from starting array
        const updatedStart = startingArray.filter((t) => t.id !== taskId);
        startingArray.length = 0;
        startingArray.push(...updatedStart);

        console.log("AFTER:", startingArray);

        // Add to ending array
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

        // Save updates
        localStorage.setItem(
          startingArrayStorage,
          JSON.stringify(startingArray)
        );
        localStorage.setItem(endingArrayStorage, JSON.stringify(endingArray));

        wrapper.remove(); // remove from UI
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
    const btn = document.createElement("btn");
    btn.textContent = "•  " + element.subTask;
    btn.classList.add("sub_task_li");

    wrapper.appendChild(btn);
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
