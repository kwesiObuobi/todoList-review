import './style.css';
import todoList from './todoList.js';
import {
  add, update, updateIndexes, remove,
} from './addRemove.js';
import { setCompleted } from './interactive.js';

const toDoBox = document.querySelector('.todo-box');
let tasks = todoList;

const renderTasks = () => {
  toDoBox.innerHTML = '';

  toDoBox.innerHTML += `
    <li class="header-li">Today's To Do <i class="fa-solid fa-rotate"></i></li>
    <li class="add-to-list"></li>
    <form class="add-list-form">
      <input type="text" id="new-item" placeholder="Add to your list" required>
      <button type="submit" class="submit-btn"><i class="fa-solid fa-plus"></i></button>
    </form>
  `;

  todoList.sort((a, b) => a.index - b.index);
  for (let i = 0; i < todoList.length; i += 1) {
    toDoBox.innerHTML += `
      <li class="list-item">
        <div class="list-check-and-name">
          <input type="checkbox" data-ch=${i} class="checkbox" value=${todoList[i] === true ? 'checked' : ''}>
          <input type="text" data-line-num=${i} class="list-item-value" value=${todoList[i].description}>
        </div>
        <div class="list-ellipses-box"><i class="fa-solid fa-ellipsis-vertical"></i></div>
        <div class="list-del-box none" data-line-num=${i}><i class="fa-regular fa-trash-can"></i></div>
      </li>
    `;
  }

  // Clear all completed
  const clearLi = document.createElement('li');
  clearLi.classList.add('clear-li');
  clearLi.innerHTML = 'Clear all completed';
  toDoBox.appendChild(clearLi);

  clearLi.addEventListener('click', () => {
    tasks = todoList.filter((item) => item.completed === false);
    todoList.splice(0, todoList.length, ...tasks);
    updateIndexes();
    localStorage.setItem('todolist', JSON.stringify(todoList));
    renderTasks();
  });
};
renderTasks();

const form = document.querySelector('.add-list-form');
const newItem = document.querySelector('#new-item');

// Add list item
form.addEventListener('submit', (e) => {
  e.preventDefault();
  add(newItem);
  newItem.value = '';
  renderTasks();
});

const checkboxes = document.querySelectorAll('.checkbox');
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    setCompleted(checkbox.getAttribute('data-ch'));
  });
});

// Change ellipses to deleteBtn when the input field is in focus
const itemValInputs = document.querySelectorAll('.list-item-value');
itemValInputs.forEach((item) => {
  item.addEventListener('click', () => {
    const els = document.querySelectorAll('.list-ellipses-box');
    const dels = document.querySelectorAll('.list-del-box');

    for (let j = 0; j < todoList.length; j += 1) {
      if (j === item.getAttribute('data-line-num')) {
        dels[j].classList.remove('none');
        dels[j].classList.add('show');
        els[j].classList.add('none');
      } else {
        els[j].classList.remove('none');
        dels[j].classList.remove('show');
        dels[j].classList.add('none');
      }
    }
  });

  item.addEventListener('keyup', (e) => {
    update(item.getAttribute('data-line-num'), 'description', e.target.value);
  });
});

const delBoxes = document.querySelectorAll('.list-del-box');
delBoxes.forEach((box) => {
  box.addEventListener('click', () => {
    remove(box.getAttribute('data-line-num'));
    renderTasks();
  });
});
