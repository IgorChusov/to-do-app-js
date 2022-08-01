
import { createTodoItem as createTodoItemOnServer, switchTodoItemDone, deleteTodoItem } from './api.js';
import { createAppTitle, createTodoItemForm, createTodoList, createTodoItem, createBtnChangeData } from './create-DOM-Element.js';
import { saveLocalListData } from './localStorage.js';

export function createApp(container, title = 'Список дел', listInLocalStrorage) {
  let nameServer = localStorage.getItem('nameServer') ? localStorage.getItem('nameServer') : 'локальное хранилище';
  localStorage.setItem('nameServer', nameServer);
  let todoAppTitle = createAppTitle(title);
  let todoItemForm = createTodoItemForm();
  let todoList = createTodoList();
  container.append(todoAppTitle);
  container.append(todoItemForm.form);
  container.append(todoList);
  createBtnChangeData(`Используется ${localStorage.getItem('nameServer')}`);
  let dataLocalStorage;
  let dataServer;

  const handlers = {
    onDone({ todoItem }) {
      todoItem.done = !todoItem.done;
      if (localStorage.getItem('nameServer') === 'локальное хранилище') {
        saveLocalListData(listInLocalStrorage, dataLocalStorage);
      } else { switchTodoItemDone(todoItem); }
    },
    onDelete({ todoItem, element }) {
      if (!confirm('Вы уверены?')) {
        return
      };
      element.remove();
      if (localStorage.getItem('nameServer') === 'локальное хранилище') {
        let index = dataLocalStorage.indexOf(todoItem);
        if (index > -1) {
          dataLocalStorage.splice(index, 1);
        };
        saveLocalListData(listInLocalStrorage, dataLocalStorage);
      } else {
        deleteTodoItem(todoItem)
      };
    }
  };

  async function checkData() {
    if (localStorage.getItem('nameServer') === 'локальное хранилище') {
      let { getLocalListData} = await import ('./localStorage.js');
      dataLocalStorage = getLocalListData(listInLocalStrorage);
      addBase(dataLocalStorage);
    } else {
      let { getServerListData } = await import ('./todoServer.js');
      dataServer = await getServerListData(listInLocalStrorage)
      addBase(dataServer)
    }

  }
  checkData();



  function addBase(base) {
    for (let elem of base) {
      let elemTodoList = createTodoItem(elem, handlers);
      todoList.append(elemTodoList.item);
      if (elem.done === true) {
        elemTodoList.item.classList.add('list-group-item-success')
      }
    }
  };

  function changeData() {
    let btnChangeData = document.querySelector('.btn-change-data');

    function changeList(newNameData) {
      localStorage.removeItem('nameServer');
      localStorage.setItem('nameServer', newNameData);
      btnChangeData.textContent = `Используется ${newNameData}`;
      document.querySelector('.list-group').innerHTML = '';
    }
    btnChangeData.addEventListener('click', async function(e) {
      e.preventDefault();
      let nameData = localStorage.getItem('nameServer');
      if (nameData === 'локальное хранилище') {
        changeList('серверное хранилище');
        checkData()
      }
      if (nameData === 'серверное хранилище') {
        changeList('локальное хранилище');
        checkData()
      }
    })
  };
  changeData()

  async function addTodoListItem() {
    let todoItemDefault = { owner: listInLocalStrorage, name: '', done: false };
    let todoItemElement;
    todoItemDefault.name = todoItemForm.input.value;
    if (localStorage.getItem('nameServer') === 'локальное хранилище') {
      let {saveLocalListData} = await import ('./localStorage.js');
      dataLocalStorage.push(todoItemDefault);
      saveLocalListData(listInLocalStrorage, dataLocalStorage);
      todoItemElement = createTodoItem(todoItemDefault, handlers)
    } else {
      let todoItem = await createTodoItemOnServer(todoItemDefault.owner, todoItemDefault.name, todoItemDefault.done);
      todoItemElement = createTodoItem(todoItem, handlers);
    }

    // создаем и добавляем в список новое дело с названием из поля для ввода
    todoList.append(todoItemElement.item);
    // обнуляем значение в поле, что бы не пришлось стирать его вручную
    todoItemForm.input.value = '';
    // после отправки кнопка переходит в неактивную
    todoItemForm.button.setAttribute('disabled', true);

  };
  //! Проверяем на наличие текста
  todoItemForm.input.addEventListener('input', function() {
    if (todoItemForm.input.value.length === 0) {
      todoItemForm.button.setAttribute('disabled', true);
    } else if (todoItemForm.input.value.length > 0) {
      todoItemForm.button.removeAttribute('disabled', true);
    }
  });
  // браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
  todoItemForm.form.addEventListener('submit', async function(e) {
    // эта строчка необходима, чтоюы предотвратить стандартное действие браузера
    // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
    e.preventDefault();
    // игноррируем создание элемента если пользователь ничего не ввел в поле
    if (!todoItemForm.input.value) {
      return;
    }
    addTodoListItem();
  })
}
