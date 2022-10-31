const tagInput = document.querySelector("#tag-input")
const tagsContainer = document.querySelector(".tags")
const tags = document.querySelectorAll(".tag");
const tagsArray = [];


tagInput.addEventListener("keydown", (e) => {
    if(e.keyCode == 13){
        let tagText = tagInput.value;
        let tag = document.createElement("div");
        tag.classList.add("tag");
        tag.appendChild(document.createTextNode(tagText));
        tagsContainer.appendChild(tag);
        tagInput.value = "";
        tagsArray.add(tag);
        tag.addEventListener("click", () => {
            tag.remove();
        })
    }
})