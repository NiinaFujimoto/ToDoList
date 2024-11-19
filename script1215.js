const inputForm = document.getElementById('taskInput');
const inputDate = document.getElementById('taskTime');
const inputNote = document.getElementById('taskDescription');
const addBtn = document.querySelector('.add-btn');
const taskList = document.querySelector('.list-items');
const compList = document.querySelector('.complete-items');

// ページがロードされたら処理を実行する
window.addEventListener('load', () => {
    displayTasks();
    displayCompletedTasks();
    TaskListBtnEvent();
    console.log("Loaded");
});

// 追加ボタンを押したら処理を実行する
addBtn.addEventListener('click', () => {
    if (!inputForm.value) {
        const errorMsg = document.querySelector('.error-msg');
        errorMsg.classList.add('show');
        return;
    }

    let taskId = setTaskId();
    let taskName = inputForm.value.trim();
    let taskNote = inputNote.value.trim();
    let taskDate = inputDate.value ? formattedDate(inputDate.value) : null;

    const task = {
        id: taskId,
        name: taskName,
        note: taskNote,
        date: taskDate,
    };

    taskList.innerHTML += createTaskElement(task);
    TaskListBtnEvent();
    saveTaskToLocalStorage(task);

    inputForm.value = '';
    inputNote.value = '';
    inputDate.value = '';
    console.log("Added");
});

inputForm.addEventListener('keyup', () => {
    const errorMsg = document.querySelector('.error-msg');
    if (errorMsg.classList.contains('show') && inputForm.value !== '') {
        errorMsg.classList.remove('show');
    }
});

// タスクHTMLを作成
const createTaskElement = (task) => `
    <li class="list-item" data-task-id="${task.id}" data-task-name="${task.name}" data-task-note="${task.note}" data-task-date="${task.date}">
        名前：${task.name}<br>
        説明：${task.note}<br>
        ${task.date ? `<div class="item-date">期日：${task.date}</div>` : ''} 
        <div class="item-btn">
            <button class="btn complete-btn">完了報告！</button>
        </div>
    </li>
    <br>`;

// 完了タスクHTMLを作成
const createcoTaskElement = (task) => `
    <li class="complete-item" data-task-id="${task.id}">
        名前：${task.name}<br>
        説明：${task.note}<br>
        ${task.date ? `<div class="item-date">期日：${task.date}</div>` : ''} 
        <div class="item-btn">
            <button class="btn delete-btn" data-task-id="${task.id}">削除する</button>
        </div>
    </li>
    <br>`;

// ローカルストレージ保存
const saveTaskToLocalStorage = (task) => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log("Task saved");
};

const saveCompletedTaskToLocalStorage = (task) => {
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    completedTasks.push(task);
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    console.log("Completed task saved");
};

// タスク表示
const displayTasks = () => {
    taskList.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => taskList.innerHTML += createTaskElement(task));
};

const displayCompletedTasks = () => {
    compList.innerHTML = '';
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    completedTasks.forEach(task => compList.innerHTML += createcoTaskElement(task));
};

// IDを生成
const setTaskId = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
};

// 完了/削除イベント
const TaskListBtnEvent = () => {
    document.querySelectorAll('.delete-btn').forEach(deleteBtn => {
        deleteBtn.addEventListener('click', (e) => {
            const deleteTarget = e.target.closest('.complete-item');
            const taskId = deleteTarget.dataset.taskId;

            const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
            const updatedCompletedTasks = completedTasks.filter(task => task.id != taskId);
            localStorage.setItem('completedTasks', JSON.stringify(updatedCompletedTasks));
            
            compList.removeChild(deleteTarget);
        });
    });

    document.querySelectorAll('.complete-btn').forEach(compBtn => {
        compBtn.addEventListener('click', (e) => {
            const compTarget = e.target.closest('.list-item');
            const taskId = compTarget.dataset.taskId;

            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const taskIndex = tasks.findIndex(task => task.id == taskId);
            if (taskIndex !== -1) {
                const completedTask = tasks.splice(taskIndex, 1)[0];
                localStorage.setItem('tasks', JSON.stringify(tasks));
                saveCompletedTaskToLocalStorage(completedTask);

                compList.innerHTML += createcoTaskElement(completedTask);
                TaskListBtnEvent();
                taskList.removeChild(compTarget);
            }
        });
    });
};

// 日付フォーマット
const formattedDate = (dateString) => {
    const selectedDate = new Date(dateString);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();
    const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
    const dayOfWeek = daysOfWeek[selectedDate.getDay()];
    return `${year}年${month}月${day}日(${dayOfWeek})`;
};
