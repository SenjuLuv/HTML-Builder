const elements = document.querySelectorAll(".element");
const dropZone = document.getElementById("drop-zone");
const elementsList = document.querySelector(".elements-list");

let selectedElement = null;

// Функция перетаскивания элементов
function addDragListeners(element) {
  element.addEventListener("dragstart", handleDragStart);
}

elements.forEach(addDragListeners);

// функция зоны отбрасывания
dropZone.addEventListener("dragover", handleDragOver);
dropZone.addEventListener("dragleave", handleDragLeave);
dropZone.addEventListener("drop", handleDrop);

function handleDragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.dataset.type);
}

function handleDragOver(e) {
  e.preventDefault();
  dropZone.classList.add("drag-over");
}

function handleDragLeave(e) {
  dropZone.classList.remove("drag-over");
}

function handleDrop(e) {
  e.preventDefault();
  dropZone.classList.remove("drag-over");

  const elementType = e.dataTransfer.getData("text/plain");
  const newElement = createPreviewElement(elementType);

  if (newElement) {
    dropZone.appendChild(newElement);
  }
}

function createPreviewElement(type) {
  const wrapper = document.createElement("div");
  wrapper.className = "preview-element";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.innerHTML = "×";
  deleteBtn.onclick = () => {
    if (selectedElement === wrapper) {
      selectedElement = null;
    }
    wrapper.remove();
  };

  let element;

  switch (type) {
    case "heading":
      element = document.createElement("h2");
      element.textContent = "New Heading";
      element.contentEditable = true;
      break;

    case "paragraph":
      element = document.createElement("p");
      element.textContent = "New paragraph text";
      element.contentEditable = true;
      break;

    case "button":
      element = document.createElement("button");
      element.textContent = "New Button";
      element.contentEditable = true;
      break;

    case "input":
      element = document.createElement("input");
      element.type = "text";
      element.placeholder = "New Input";
      break;

    default:
      element = document.createElement(type);
      if (type === "textarea") {
        element.placeholder = "Enter text here...";
      } else if (type === "input") {
        element.type = "text";
        element.placeholder = "New Input";
      } else {
        element.textContent = "New Element";
        element.contentEditable = true;
      }
      break;
  }

  wrapper.appendChild(element);
  wrapper.appendChild(deleteBtn);

  wrapper.addEventListener("click", (e) => {
    if (e.target !== deleteBtn) {
      if (selectedElement) {
        selectedElement.classList.remove("selected");
      }
      selectedElement = wrapper;
      wrapper.classList.add("selected");
    }
  });

  return wrapper;
}

window.addCustomElement = function () {
  const elementName = document.getElementById("elementName").value.trim();
  const elementType = document.getElementById("elementType").value;

  if (!elementName) {
    alert("Некорректно заполнено поле");
    return;
  }

  const newElement = document.createElement("div");
  newElement.className = "element";
  newElement.draggable = true;
  newElement.dataset.type = elementType;
  newElement.textContent = elementName;

  addDragListeners(newElement);
  elementsList.appendChild(newElement);

  document.getElementById("elementName").value = "";
};

// контроль стилей
const styleControls = {
  textColor: document.getElementById("textColor"),
  bgColor: document.getElementById("bgColor"),
  fontSize: document.getElementById("fontSize"),
  padding: document.getElementById("padding"),
  borderRadius: document.getElementById("borderRadius"),
  borderWidth: document.getElementById("borderWidth"),
  borderColor: document.getElementById("borderColor"),
  textAlign: document.getElementById("textAlign"),
};

// Добавить прослушиватели событий для элементов управления стилем
Object.entries(styleControls).forEach(([property, control]) => {
  control.addEventListener("input", () => {
    if (selectedElement) {
      const element = selectedElement.firstElementChild;

      switch (property) {
        case "textColor":
          element.style.color = control.value;
          break;
        case "bgColor":
          element.style.backgroundColor = control.value;
          break;
        case "fontSize":
          element.style.fontSize = `${control.value}px`;
          break;
        case "padding":
          element.style.padding = `${control.value}px`;
          break;
        case "borderRadius":
          element.style.borderRadius = `${control.value}px`;
          break;
        case "borderWidth":
          element.style.borderWidth = `${control.value}px`;
          element.style.borderStyle = control.value > 0 ? "solid" : "none";
          break;
        case "borderColor":
          element.style.borderColor = control.value;
          break;
        case "textAlign":
          element.style.textAlign = control.value;
          break;
      }
    }
  });
});
