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
            data: [3, 1, 2],//デフォルト
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
    //タスク表の子要素の長さ(数)を取得
    let todoCount = listTodo.children.length;
    let doingCount = listDoing.children.length;
    let doneCount = listDone.children.length;

    //円グラフの中身に数を代入
    progressChart.data.datasets[0].data = [doneCount, doingCount, todoCount];
    progressChart.update();
}

// Function to render taskLists in the lists　タスクを表示
function renderTaskLists() {
    //taskListsに入った情報を



    //グラフも更新しとく
    updateChart();
}


//追加機能 listの末尾に追加するタスクが入る
function addTask(list,task){//taskLists.todo,task
    //li要素を新生成
    const listItem = document.createElement('li');
    //中身を書き込む
    listItem.innerHTML = `
        ${task.name} - ${task.priority} <br> ${task.when} @ ${task.where}
        ${list ? `<button class="move-btn" onclick="moveTask('${task.name}', '${list}')">Move to nextStage</button>` : ''}
        <button class="delete-btn" onclick="removeTask('${task.name}')">Delete</button>
    `;
    //リストの末尾に追加
    list.appendChild(listItem);
}




// 新しいタスクを追加するイベント
taskForm.addEventListener('submit', event => {
    //このイベントが明示的に処理されない場合に、その既定のアクションを通常どおりに行うべきではないことを伝える
    event.preventDefault();

   //タスクの各要素の値をそれぞれ代入する
    let task = {
        name: document.getElementById('taskInput').value.trim(),
        priority: document.getElementById('taskPriority').value,
        when: document.getElementById('taskTime').value,
        where: document.getElementById('taskLocation').value,
        label: document.getElementById('taskLabel').value
    };

    addTask(taskLists.todo,task);
    renderTaskLists();
    logActivity(`Added task: ${task.name}`);

    //modal.style.display = 'none';
    taskForm.reset();
});

// Move task between columns
function moveTask(taskName, targetList) {//task.name ,taskList
    let task = taskLists.todo.find(t => t.name === taskName) || taskLists.doing.find(t => t.name === taskName);

    if (targetList === 'todo') {
        taskLists.todo = taskLists.todo.filter(t => t.name !== taskName);
        taskLists.doing.push(task);
    } else if (targetList === 'doing') {
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

// Initial render初期表示
renderTaskLists();
