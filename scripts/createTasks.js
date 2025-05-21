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

const deleteButton = (dropdown, btn) => {

}
export { strikeThroughButton }