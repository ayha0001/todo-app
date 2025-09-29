"use strict";

console.log("Script connected");

// Variabler for html elementer
const inputFelt = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const addBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const doneList = document.getElementById("doneList");

// Variabler for tællere i header
const tasksCountEl = document.getElementById("taskCount");
const doneCountEl = document.getElementById("doneCount");

// Array hvor alle opgaver gemmes, med de egenskaber som defineres i addTask
let allTasksArr = [];

// Funktion der henter opgaver fra localStorage og bygger listen
function loadTasks() {
  // Hvis der er gemte opgaver i localStorage, hentes de og parses til array
  const tasks = localStorage.getItem("tasks");
  if (tasks) {
    allTasksArr = JSON.parse(tasks);
  }
  // Opdater listen
  buildList();
}

// Kald denne når siden loader
window.addEventListener("DOMContentLoaded", loadTasks);

// Når bruger klikker på knappen, kaldes funktionen addTask
addBtn.addEventListener("click", addTask);

// Funktion der definere en opgave og tilføjer den til arrayet
function addTask() {
  // Hent opgave og dato som bruger skriver i input felterne
  const name = inputFelt.value.trim();
  const date = dueDate.value;

  // Hvis opgave og dato er tom, vis advarsel på skærm og i konsol
  if (name === "" && date === "") {
    alert("Please enter a task and date");
    console.log("Missing task and date");
    return;
    // Hvis opgave er tom, vis advarsel på skærm og i konsol
  } else if (name === "") {
    alert("Please enter a task");
    console.log("Missing task");
    return;
    // Hvis dato er tom, vis advarsel på skærm og i konsol
  } else if (date === "") {
    alert("Please choose a date");
    console.log("Missing date");
    return;
  }

  // Opretter nyt objekt med navn, dato, id og om opgaven er gennemført, hvor default er ikke gennemført
  const newTask = {
    id: self.crypto.randomUUID(),
    name,
    date,
    completed: false,
  };

  // Tilføjer opgaven til starten af arrayet
  allTasksArr.unshift(newTask);
  console.log("Opgave:", name, "Dato:", date, "ID:", newTask.id);

  // Ryder input felter efter opgave er tilføjet
  inputFelt.value = "";
  dueDate.value = "";

  // Opdater listen
  saveTasks();
  buildList();
}

// Funktion der laver listen af opgaver
function buildList() {
  // Rydder listerne så de kan genopbygges
  taskList.innerHTML = "";
  doneList.innerHTML = "";

  // Definer tællere, default er 0
  let todoCount = 0;
  let doneCount = 0;

  // Looper igennem alle opgaver i arrayet
  allTasksArr.forEach((newTask) => {
    // Opret li til denne opgave
    const listItem = document.createElement("li");
    // Tilføj en class til css styling
    listItem.classList.add("task-row");
    // HTML-struktur bliver sådan: navn | dato | knapper
    listItem.innerHTML = `
      <span class="task-name">${newTask.name}</span>
      <span class="task-date">${newTask.date}</span>
      <span class="task-buttons">
        <button class="toggle">${newTask.completed ? "Undo" : "Done"}</button>
        <button class="delete">Delete</button>
      </span>
    `;

    // Find knapperne i det oprettede li element
    const toggleBtn = listItem.querySelector(".toggle");
    const deleteBtn = listItem.querySelector(".delete");

    // Gør knapperne funktionelle
    // Når der klikkes på toggle knappen, ændres completed status og listen genopbygges
    toggleBtn.addEventListener("click", () => {
      newTask.completed = !newTask.completed;
      saveTasks();
      buildList();
    });

    // Når der klikkes på delete knappen, fjernes opgaven fra arrayet og listen genopbygges
    deleteBtn.addEventListener("click", () => {
      // !== betyder "ikke lig med", så alle opgaver der ikke har samme id som den opgave der klikkes på, forbliver i arrayet
      // Den opgave der klikkes på, fjernes
      allTasksArr = allTasksArr.filter((task) => task.id !== newTask.id);
      saveTasks();
      buildList();
    });

    // Opgaven tilføjes til enten todo listen eller completed listen, baseret på completed status
    // Hvis opgaven er completed, tilføjes den til doneList og doneCount tælleren øges
    if (newTask.completed) {
      doneList.appendChild(listItem);
      doneCount++;
      // Hvis opgaven ikke er completed, tilføjes den til taskList og todoCount tælleren øges
    } else {
      taskList.appendChild(listItem);
      todoCount++;
    }
  });

  // Tællerne i html opdateres
  if (tasksCountEl) tasksCountEl.textContent = todoCount;
  if (doneCountEl) doneCountEl.textContent = doneCount;
}

// Funktion der gemmer opgaver i localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(allTasksArr));
}
