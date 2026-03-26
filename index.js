let items = [
	"Сделать проектную работу",
	"Полить цветы",
	"Пройти туториал по Реакту",
	"Сделать фронт для своего проекта",
	"Прогуляться по улице в солнечный день",
	"Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");

function loadTasks() {
	const saved = localStorage.getItem("tasks");
	return saved ? JSON.parse(saved) : items;
}

function saveTasks() {
	const tasks = getTasksFromDOM();
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasksFromDOM() {
	const textElements = document.querySelectorAll(".to-do__item-text");
	return Array.from(textElements).map((el) => el.textContent);
}

function createItem(itemText) {
	const template = document.getElementById("to-do__item-template");
	const clone = template.content.querySelector(".to-do__item").cloneNode(true);

	const textElement = clone.querySelector(".to-do__item-text");
	const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
	const duplicateButton = clone.querySelector(
		".to-do__item-button_type_duplicate",
	);
	const editButton = clone.querySelector(".to-do__item-button_type_edit");

	textElement.textContent = itemText;

	deleteButton.addEventListener("click", () => {
		clone.remove();
		saveTasks();
	});

	duplicateButton.addEventListener("click", () => {
		navigator.clipboard.writeText(textElement.textContent).then(() => {
			duplicateButton.style.opacity = "0.5";
			setTimeout(() => (duplicateButton.style.opacity = "1"), 500);
		});
	});

	editButton.addEventListener("click", () => {
		const isEditing = textElement.getAttribute("contenteditable") === "true";
		if (!isEditing) {
			textElement.setAttribute("contenteditable", "true");
			textElement.focus();
		} else {
			textElement.setAttribute("contenteditable", "false");
			saveTasks();
		}
	});

	textElement.addEventListener("blur", () => {
		textElement.setAttribute("contenteditable", "false");
		saveTasks();
	});

	textElement.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			textElement.blur();
		}
	});

	return clone;
}

loadTasks().forEach((text) => {
	const element = createItem(text);
	listElement.append(element);
});

formElement.addEventListener("submit", (e) => {
	e.preventDefault();
	const taskText = inputElement.value.trim();

	if (taskText !== "") {
		const newElement = createItem(taskText);
		listElement.prepend(newElement);
		inputElement.value = "";
		saveTasks();
	}
});