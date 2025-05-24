import { addTaskToCompleted, createTaskButtons } from "./script.js";

// STRIKETHROUGH BUTTON
const strikeThroughButton = (dropdown, btn) => {
  const strikeBtn = dropdown.querySelector("#strike_btn");
  if (strikeBtn) {
    strikeBtn.addEventListener("click", () => {
      btn.style.textDecoration =
        btn.style.textDecoration === "line-through" ? "none" : "line-through";
    });
  }
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
  console.log("BEFORE:", startingArray);
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
        localStorage.setItem(startingArrayStorage, JSON.stringify(startingArray));
        localStorage.setItem(endingArrayStorage, JSON.stringify(endingArray));

        wrapper.remove(); // remove from UI
      } else {
        console.log("NOT FOUND");
      }
    });
  }
};

export { strikeThroughButton, deleteButton, completedButton };
