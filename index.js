let tasksList = [];
let ids = 0;

class Task {
  constructor(description, completed, index) {
    this.description = description;
    this.completed = completed;
    this.index = index;
  }
}

const listItems = document.getElementById('list-elem');

const showItems = (list) => {
  listItems.innerHTML = '';
  list.forEach((task) => {
    const taskElement = document.createElement('div');

    const descriptionElem = document.createElement('span');
    descriptionElem.innerText = task.description;
    descriptionElem.id = `id${task.index}`;
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.id = task.index;
    checkBox.name = 'listElem';

    editTask(descriptionElem, list, task.index);

    taskElement.classList.add('task-element');
    taskElement.appendChild(checkBox);
    taskElement.appendChild(descriptionElem);
    listItems.appendChild(taskElement);
  });

  addCheck(list);

  return listItems;
};

const updateCheck = (list) => {
  const checkboxes = document.querySelectorAll('input[name="listElem"]');
  checkboxes.forEach((checks) => {
    list.forEach((elem) => {
      const ids = parseInt(checks.id, 10);
      if (ids === elem.index) {
        checks.checked = elem.completed;
        completedTask(checks.id, elem.completed);
      }
    });
  });
};

window.onload = () => {
  const local = window.localStorage.getItem('tasklist');
  if (local != null) {
    tasksList = JSON.parse(local);
    ids = tasksList.length;
  }
  showItems(tasksList);
  saveList(tasksList);
  updateCheck(tasksList);
};

const textBox = document.getElementById('new-task');
textBox.addEventListener('keypress', (event) => {
  const local = window.localStorage.getItem('tasklist');
  tasksList = JSON.parse(local);
  if (event.key === 'Enter' && textBox.value !== '') {
    ids = tasksList.length;
    tasksList.push(new Task(textBox.value, false, (ids += 1)));
    textBox.value = '';
    showItems(tasksList);
    saveList(tasksList);
    updateCheck(tasksList);
  }
});

const saveList = (list) => {
  window.localStorage.setItem('tasklist', JSON.stringify(list));
};

const statusCompleted = (list, id, status) => {
  list.forEach((elem) => {
    const ids = parseInt(elem.index, 10);
    const listId = parseInt(id, 10);
    if (ids === listId) {
      elem.completed = status;
    }
  });
  saveList(list);
  return list;
};

const completedTask = (id, status) => {
  const spanFinished = document.getElementById(`id${id}`);
  const statStri = status.toString();
  if (statStri === 'true') {
    spanFinished.classList.add('checked');
  } else if (statStri === 'false') {
    spanFinished.classList.remove('checked');
  }
};

const addCheck = (list) => {
  const checkboxes = document.querySelectorAll('input[name="listElem"]');
  checkboxes.forEach((checks) => {
    checks.onchange = function func() {
      statusCompleted(list, checks.id, this.checked);
      completedTask(checks.id, this.checked);
    };
  });
};

// function for update index of each element position
function updatePosition(list) {
  list.forEach((task, id) => {
    task.index = id + 1;
  });
}

function deleteTask(del, indx, list) {
  del.addEventListener('click', () => {
    list.forEach((task) => {
      const id = parseInt(indx, 10);
      if (task.index === id) {
        const indice = list.indexOf(task);
        list.splice(indice, 1);
        updatePosition(list);
        showItems(list);
        saveList(list);
        updateCheck(list);
      }
    });
  });
}

// function for delete all completed
const deleteCompleted = () => {
  const deletButon = document.getElementById('deleteButton');
  deletButon.addEventListener('click', () => {
    const local = window.localStorage.getItem('tasklist');
    const list = JSON.parse(local);
    const newList = list.filter((task) => task.completed === false);
    // update array in document
    tasksList = newList;
    updatePosition(newList);
    showItems(newList);
    saveList(newList);
  });
}

deleteCompleted();

const updateArray = (list, id, value) => {
  list.forEach((elem) => {
    if (id === elem.index) {
      elem.description = value;
    }
  });
  saveList(list);
  return list;
};

// hay un error en esta funcion, despues de editar una task, si la eliminas seguido de eso se elimina junto con el elemento siguiente

function editTask(oldTask, list, id) {
  const newText = document.createElement('input');
  newText.type = 'text';
  const deletButon = document.createElement('input');
  deletButon.type = 'button';
  deletButon.value = 'delete';

  oldTask.addEventListener('click', () => {
    newText.value = oldTask.innerHTML;
    oldTask.parentNode.replaceChild(newText, oldTask);
    newText.parentNode.appendChild(deletButon);

    const sibling = newText.parentNode.firstChild;
    newText.focus();
    deleteTask(deletButon, sibling.id, list);
  });

  newText.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      oldTask.innerHTML = newText.value;
      newText.parentNode.replaceChild(oldTask, newText);
      oldTask.parentNode.removeChild(deletButon);
      updateArray(list, id, newText.value);
    }
  });
}