// Function to update the current date and time リアタイ時間表示
function updateDateTime() {
    const now = new Date();
    document.getElementById('currentDateTime').textContent = now.toLocaleString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}



let taskLists = {
    todo: [],
    doing: [],
    done: []
};
let activityLog = [];


// html.list-OO => JS.listOO
const listTodo = document.getElementById('list-todo');
const listDoing = document.getElementById('list-doing');
const listDone = document.getElementById('list-done');



//Create Chart
const ctx = document.getElementById('progress-chart').getContext('2d');
let progressChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['完了タスク','作業中タスク', '未完了タスク'],
        datasets: [{
            data: [3, 1, 2],
            //data: [doneCount, doingCount, todoCount],
            backgroundColor: ['#00bfff', '#00ff7f', '#ff6347']
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

// Function to update the chart
function updateChart() {
    const ctx = document.getElementById('progress-chart').getContext('2d');

    let todoCount = listTodo.children.length;
    let doingCount = listDoing.children.length;
    let doneCount = listDone.children.length;

    progressChart.data.datasets[0].data = [todoCount, doingCount, doneCount];
    progressChart.update();
}

// Function to render taskLists in the lists タスクステータスをリストに表示する関数
function renderTaskLists() {

    /*listTodo.innerHTML = '';//html.list-todoの子要素を全消し
    listDoing.innerHTML = '';
    listDone.innerHTML = '';*/

    //それぞれの形にtaskを生成する。
    taskLists.todo.forEach(task => moveTaskElement(listTodo, task, 'doing'));
    taskLists.doing.forEach(task => moveTaskElement(listDoing, task,'done'));
    taskLists.done.forEach(task => moveTaskElement(listDone, task));

    updateChart();
}


//リスト配列の中身を次の段階に移動させる
function moveTaskElement(list, task) {
    //li要素を新生成
    const listItem = document.createElement('li');
    //中身を書き込む
    listItem.innerHTML = `
        ${task.name} - ${task.priority} <br> ${task.when} @ ${task.where}
        ${nextList ? `<button class="move-btn" onclick="moveTask('${task.name}', '${nextList}')">Move to ${nextList}</button>` : ''}
        <button class="delete-btn" onclick="removeTask('${task.name}')">Delete</button>
    `;

}







function addTask(list,task){
    //li要素を新生成
    const listItem = document.createElement('li');
    //中身を書き込む
    listItem.innerHTML = `
        ${task.name} - ${task.priority} <br> ${task.when} @ ${task.where}
        ${nextList ? `<button class="move-btn" onclick="moveTask('${task.name}', '${nextList}')">Move to ${nextList}</button>` : ''}
        <button class="delete-btn" onclick="removeTask('${task.name}')">Delete</button>
    `;
    //リストの末尾に追加
    list.appendChild(listItem);
}




// 新しいタスクを追加する
taskForm.addEventListener('submit', event => {
    //このイベントが明示的に処理されない場合に、その既定のアクションを通常どおりに行うべきではないことを伝える
    event.preventDefault();

    

   //タスクの各要素の値をそれぞれ代入する
    let task = {
        name: document.getElementById('taskInput').value,
        priority: document.getElementById('taskPriority').value,
        when: document.getElementById('taskTime').value,
        where: document.getElementById('taskLocation').value,
        label: document.getElementById('taskLabel').value
    };

    /*新しい要素を配列の末尾に追加し、配列の新しい長さを返します。param items - 配列に追加する新しい要素。
    taskLists.todo.push(task);*/
    addTask(taskLists.todo,task);
    renderTaskLists();
    logActivity(`Added task: ${task.name}`);

    modal.style.display = 'none';
    taskForm.reset();
    updateChart();
});

// Move task between columns
function moveTask(taskName, targetList) {//task.name ,nextList
    let task = taskLists.todo.find(t => t.name === taskName) || taskLists.doing.find(t => t.name === taskName);

    if (targetList === 'doing') {
        taskLists.todo = taskLists.todo.filter(t => t.name !== taskName);
        taskLists.doing.push(task);
    } else if (targetList === 'done') {
        taskLists.doing = taskLists.doing.filter(t => t.name !== taskName);
        taskLists.done.push(task);
    }

    renderTaskLists();
    logActivity(`Moved task: ${taskName} to ${targetList}`);
}

// Remove task
function removeTask(taskName) {
    taskLists.todo = taskLists.todo.filter(t => t.name !== taskName);
    taskLists.doing = taskLists.doing.filter(t => t.name !== taskName);
    taskLists.done = taskLists.done.filter(t => t.name !== taskName);
    renderTaskLists();
    logActivity(`Deleted task: ${taskName}`);
}

// Activity log function
function logActivity(action) {
    const log = `${new Date().toLocaleString('ja-JP')}: ${action}`;
    activityLog.push(log);
    const activityLogElement = document.getElementById('activityLog');
    const logElement = document.createElement('li');
    logElement.textContent = log;
    activityLogElement.appendChild(logElement);
}

// Initial render
renderTaskLists();
