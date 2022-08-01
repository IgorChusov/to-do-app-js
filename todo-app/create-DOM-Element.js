export { createAppTitle, createTodoItemForm, createTodoList, createBtnChangeData, createTodoItem }

function createAppTitle(title) {
  let appTitle = document.createElement('h2');
  appTitle.classList.add('titleList');
  appTitle.innerHTML = title;
  return appTitle;
}
//! создаем и возвращаем форму для создания дела
function createTodoItemForm() {
  let form = document.createElement('form');
  let input = document.createElement('input');
  let buttonWrapper = document.createElement('div');
  let button = document.createElement('button');

  form.classList.add('input-group', 'mb-3');
  input.classList.add('form-control');
  input.placeholder = 'Введите название нового дела';
  buttonWrapper.classList.add('input-group-append');
  button.classList.add('btn', 'btn-primary');
  button.textContent = 'Добавить дело';
  button.setAttribute('disabled', true);
  buttonWrapper.append(button);
  form.append(input);
  form.append(buttonWrapper);
  return {
    form,
    input,
    button,
  };
}
//! создаем и возвращем список элементов
function createTodoList() {
  let list = document.createElement('ul');
  list.classList.add('list-group');
  return list;
}

// создаем кнопку смены хранилища
function createBtnChangeData(nameRepository) {
  let container = document.querySelector('.container-btn-change-data')
  let btn = document.createElement('button');
  btn.classList.add('btn-change-data', 'btn-success');
  btn.textContent = `${nameRepository}`;
  container.append(btn);
}

function createTodoItem(todoItem, { onDone, onDelete }) {
  let classDone = 'list-group-item-success';
  let item = document.createElement('li');
  // кнопки помещаем в элемент, который красиво покажет их в одной группе
  let buttonGroup = document.createElement('div');
  let doneButton = document.createElement('button');
  let deleteButton = document.createElement('button');
  // Устанавливаем стили для элемента списка, а также для размещения кнопок
  // в его правой части с помощью display: flex
  item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
  if (todoItem.done) {
    item.classList.add(classDone);
  }
  item.textContent = todoItem.name;
  buttonGroup.classList.add('btn-group', 'btn-group-sm');
  doneButton.classList.add('btn', 'btn-success');
  doneButton.textContent = 'Готово';
  deleteButton.classList.add('btn', 'btn-danger');
  deleteButton.textContent = 'Удалить';
  // вкладываем кнопки в отдельный элемент, что бы они объединились
  buttonGroup.append(doneButton);
  buttonGroup.append(deleteButton);
  item.append(buttonGroup);
  doneButton.addEventListener('click', () => {
    onDone({ todoItem, element: item });
    item.classList.toggle(classDone, todoItem.done)
  })
  deleteButton.addEventListener('click', () => {
      onDelete({ todoItem, element: item });
    })
    // приложению нужен доступ к самому элементу и кнопкам, что бы обрабатывать события нажатия
  return {
    item,
    doneButton,
    deleteButton,

  };

}