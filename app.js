const taskInput = document.getElementById("task_input");
const taskAddBtn = document.getElementById("add");
const pinnedTasks = document.querySelector(".app__tasks__pinned");
const generalTasks = document.querySelector(".app__tasks");
const noTaskMesage = document.querySelector(".no--tasks");

let tasks = [];
let pinned = [];

// execute the addtask function only when the user click on the button (add) or click enter key when typing the task
taskAddBtn.addEventListener("click", addTask);
taskInput.addEventListener("keyup", function (e) {
    if (e.key === "Enter") addTask();
});

function addTask() {
    // ====== create pin and delete icons =========
    let pinElement = document.createElement("div");
    pinElement.className = "pin--icon";
    pinElement.insertAdjacentHTML("afterbegin", '<i class="fas fa-thumbtack"></i>');

    let trashElement = document.createElement("div");
    trashElement.className = "delete--icon";
    trashElement.insertAdjacentHTML("afterbegin", '<i class="fas fa-trash"></i>');

    // listen to click events on pin and delete icons
    pinElement.addEventListener("click", pinTask);
    trashElement.addEventListener("click", deleteTask);

    // check if there is a valide task value
    if (checkTask(taskInput.value)) {
        // store and remove spaces around the input value string
        let task = taskInput.value.trim();

        // empty the input
        taskInput.value = "";

        // add the task to tasks array
        tasks.push(task);

        // create task container
        let taskElement = document.createElement("div");
        taskElement.className = "app__task";

        // create required elements [the check square element and the task paragraph]
        let taskInfo = `
            <div class="app__task--checkbox">
                <input class="checkbox--input" id="task-${tasks.length}" type="checkbox" data-task="Learn UX" />
                <label class="fake--checkbox" for="task-${tasks.length}">
                    <span class="checkbox--square">
                        <svg width="20px" height="20px">
                            <use xlink:href="#check"></use>
                        </svg>
                    </span>
                </label>
            </div>

            <p class="app__task--element" data-task="${task}">${task}</p>
        `;
        // add the required elemenrs above to the task container
        taskElement.insertAdjacentHTML("beforeend", taskInfo);
        // add the pin and trash icons
        taskElement.append(pinElement);
        taskElement.appendChild(trashElement);

        // then add that task container to the DOM (automatically to the general task element)
        generalTasks.insertAdjacentElement("afterbegin", taskElement);

        // select the radio input and make it listen to the change events whenever the user change the state (value) of that input
        let taskRadio = taskElement.querySelector("input");
        taskRadio.addEventListener("change", completeTask);

        // this will remove the message (hi do you have any plans for today )
        showMessage();
    }
}

function checkTask(element) {
    //  check if the input value is not empty string and have atleast one character
    return element != "" && /\w+/g.test(element);
}

function pinTask() {
    // select the task element
    let task = this.parentElement;

    // check if the task is in general tasks container
    if (task.parentElement == generalTasks) {
        // if true then move the task to the pinned tasks container
        pinnedTasks.appendChild(task);
        // change the color of the icon
        this.style.color = "var(--checkbox-clr)";
        // add the task to the pinned array (we will use it later to know if there is pinned task or not )
        pinned.push(task);
    } else {
        // if false then move the task to the general tasks
        generalTasks.appendChild(task);
        // and reset the color of the icon
        this.style.color = "silver";
        // and remove the task from the pinned array
        pinned.splice(pinned.indexOf(task), 1);
    }

    showPinnedContainer();
}

function deleteTask() {
    // store the task element
    let task = this.parentElement;
    // make sure to delete the task from the array that contains it
    if (pinned.includes(task)) {
        pinned.splice(pinned.indexOf(task), 1);
    }
    // then remove that element from the DOM
    task.parentElement.removeChild(task);

    showPinnedContainer();
    // make the message visible when no task is found
    showMessage();
}
// this function checks if there are pinned tasks , if not it'll disappear the pinned tasks container(title etc)
function showPinnedContainer() {
    if (pinned.length) {
        pinnedTasks.style.display = "block";
    } else {
        pinnedTasks.style.display = "none";
    }
}

//  this checks if there are any tasks, if not it'll show the message placeholder (hi do you have ...)
function showMessage() {
    if (!document.querySelector(".app__task")) {
        noTaskMesage.style.display = "block";
    } else {
        noTaskMesage.style.display = "none";
    }
}

// will execute when the user check a task
function completeTask() {
    // first we store the task and the task paragraphe
    let task = this.parentElement.parentElement;
    let taskText = this.parentElement.nextElementSibling;
    // then check if it's checked or not
    if (this.checked) {
        // task.parentElement.appendChild(task); // this will take the comleted tasks to the bottom of theire container (maybe useful but nah I don't like it)

        // change the opacity and add a line through it
        task.style.opacity = "0.7";
        taskText.style.textDecoration = "line-through var(--btns-clr) solid 4px";
    } else {
        // reset the initial state
        task.style.opacity = "1";
        taskText.style.textDecoration = "none";
    }
}
