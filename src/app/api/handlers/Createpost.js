import { createPost } from "../../api/auctionItems/create";
export function setCreateFormListener() {
  const form = document.querySelector("#createPost");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);
      const post = Object.fromEntries(formData.entries());
      // Send it to the API
      createPost(post);
    });
  }
}
