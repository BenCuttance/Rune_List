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

export { strikeThroughButton, deleteButton }