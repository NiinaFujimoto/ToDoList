const inputForm = document.getElementById('taskInput');
const inputDate = document.getElementById('taskTime');
const inputNote = document.getElementById('taskDescription');
const addBtn = document.querySelector('.add-btn');
const taskList = document.querySelector('.list-items');
const compList = document.querySelector('.complete-items');

let Id = '';

// ページがロードされたら処理を実行する
window.addEventListener('load', () => {
  displayTasks();
  TaskListBtnEvent();
  console.log("Loaded");
});

// 追加ボタンを押したら処理を実行する
addBtn.addEventListener('click', () => {
    // タスクの入力フォームが空の場合
    if (!inputForm.value) {
        const errorMsg = document.querySelector('.error-msg');
        // errorMsgにshowクラスを追加する
        errorMsg.classList.add('show');
        return;
    }
    
    // タスクidを設定する
    let taskId = setTaskId();
    let taskName = inputForm.value.trim();
    let taskNote = inputNote.value.trim();
    let taskDate = inputDate.value ? formattedDate(inputDate.value) : null;
    // タスクのデータのオブジェクトを作成する
    const task = {
        id: taskId,
        name: taskName,
        note: taskNote,
        date: taskDate,
    };
    // タスクリスト(ulタグ)にタスクを追加する 
    taskList.innerHTML += createTaskElement(task); 
    // 完了ボタン、削除ボタンのイベント
    TaskListBtnEvent();
    // ローカルストレージにタスクデータを保存する
    saveLocalStorage(task);
    // 入力フォームをリセットする
    inputForm.value = '';
    inputNote.value = '';
    inputDate.value = '';
    console.log("Added");
});

// タスクの入力フォームでキーが離されたときに処理を実行する
inputForm.addEventListener('keyup', () => {
  const errorMsg = document.querySelector('.error-msg');
  // errorMsgにshowクラスがある場合
  if (errorMsg.classList.contains('show')) {
    // タスクの入力フォームが空がどうか
    if (inputForm.value !== '') {
      // errorMsgのshowクラスを取り除く
      errorMsg.classList.remove('show');
    }
  }
});

// Todoタスクを表示するためのHTMLタグを作成する
const createTaskElement = (task) => {
    return `
    <li class="list-item" data-task-id="${task.id}" data-task-name="${task.name}" data-task-note="${task.note}" data-task-date="${task.date}">
        名前：${task.name}
        <br>
        説明：${task.note}
        <br>
        ${task.date ? `<div class="item-date">期日：${task.date}</div>` : ''} 
        <div class="item-btn">
            <button class="btn complete-btn">完了報告！</button>
        </div>
    </li>
    <br>
    `;
};

// 完了タスクを表示するためのHTMLタグを作成
const createcoTaskElement = (task) => {
  return `
  <li class="complete-item" data-task-id="${task.id}">
        名前：${task.name}
        <br>
        説明：${task.note}
        <br>
        ${task.date ? `<div class="item-date">期日：${task.date}</div>` : ''} 
      <div class="item-btn">
          <button class="btn delete-btn" data-task-id="${task.id}">削除する</button>
      </div>
  </li>
  <br>
  `;
};

// ローカルストレージにタスクを保存する
const saveLocalStorage = (task) => { 
    // ローカルストレージに保存されているタスクデータを取得する
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // tasksに入力したタスクデータを追加する
    tasks.push(task);
    // ローカルストレージにtasksを保存する
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log("saved");
};

// ローカルストレージにタスクがある場合は表示する
const displayTasks = () => {
  // taskList(ulタグ)をリセットする
  taskList.innerHTML = '';
  compList.innerHTML = '';
  // ローカルストレージに保存されているタスクデータを取得する
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  //ローカルストレージにタスクのデータが1つ以上ある場合
  if(tasks.length !== 0) {
    //タスクを1つずつ取り出して処理をする
    tasks.forEach((task) => {

      if (Id.match(/c/)) {
        //Idにcを含む場合の処理
          //compList(ulタグ)にタスクを追加する
          compList.innerHTML += createcoTaskElement(task);
        }else{
        //taskList(ulタグ)にタスクを追加する
        taskList.innerHTML += createTaskElement(task);
        }
    });
  }
};

// タスクのidをセットする
const setTaskId = () => {
  // ローカルストレージに保存されているタスクデータを取得する
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  // ローカルストレージにタスクのデータが1つ以上ある場合
  if (tasks.length !== 0) {
    const task = tasks[tasks.length - 1];
    return task.id + 1;
  }
  return 1;
};

// 期日のフォーマットを変更する
const formattedDate = (dateString) => {
  const selectedDate = new Date(dateString);
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1; 
  const day = selectedDate.getDate();
  const getDay = selectedDate.getDay();
  const daysOfWeek = ['日','月','火','水','木','金','土'];
  const dayOfWeek = daysOfWeek[getDay];
    
  return `${year}年${month}月${day}日(${dayOfWeek})`;  
}

// タスクの完了や削除の処理を実装
const TaskListBtnEvent = () => {
    const deleteBtns = document.querySelectorAll('.delete-btn');
    const compBtns = document.querySelectorAll('.complete-btn');
    
    // deleteBtnsを1つずつ取り出して処理を実行する
    deleteBtns.forEach((deleteBtn) => {
        // 削除ボタンをクリックすると処理を実行する
        deleteBtn.addEventListener('click', (e) => {
            // 削除するタスクのliタグを取得
            const deleteTarget = e.target.closest('.complete-item');
            // ローカルストレージに保存されているタスクデータを取得する
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            // 削除するタスクのliタグのデータ属性(タスクid)を取得
            const dTargetId = deleteTarget.closest('li').dataset.taskId;
            // tasksから削除するタスクを取り除く
            const updatedTasks = tasks.filter(task => task.id !== parseInt(dTargetId));
            // ローカルストレージにupdatedTasksを保存する
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            // taskListから削除するタスクを取り除く
            compList.removeChild(deleteTarget.closest('li'));
        });
    });
  
    // compBtnsを1つずつ取り出して処理を実行する
    compBtns.forEach((compBtn) => {
        // 完了ボタンをクリックすると処理を実行する
        compBtn.addEventListener('dblclick', (e) => {
            const compTarget = e.target.closest('.list-item');
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const taskId = compTarget.dataset.taskId; // Get task ID from the data attribute

            // Create the completed task object with the correct properties
            let task = {
                id: 'c' + taskId, // Prefix with "c" for completed tasks
                name: compTarget.dataset.taskName, // Correctly fetch the task name
                note: compTarget.dataset.taskNote, // Correctly fetch the task note
                date: compTarget.dataset.taskDate, // Correctly fetch the task date
            };

            Id = task.id;

            // Add the completed task to the completed list
            compList.innerHTML += createcoTaskElement(task);

            // Rebind the event listeners for delete and complete buttons
            TaskListBtnEvent();

            // Save the completed task to localStorage
            saveLocalStorage(task);

            // Remove the completed task from the original list
            const updatedTasks = tasks.filter(task => task.id !== parseInt(taskId));
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));

            taskList.removeChild(compTarget); 
        });
    });
};
