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

let activityLog = [];


// html.list-OO => JS.listOO
const listTodo = document.getElementById('list-todo');
const listDoing = document.getElementById('list-doing');
const listDone = document.getElementById('list-done');



//Create Chart

var ListData = [3,1,2]; // グラフデータ（描画するデータ）
// ページ読み込み時にグラフを描画
getData(); // グラフデータに値を格納
drawChart(); // グラフ描画処理を呼び出す
// ボタンをクリックしたら、グラフを再描画
document.getElementById('addTaskBtn').onclick = function() {
  // すでにグラフ（インスタンス）が生成されている場合は、グラフを破棄する
  if (myChart) {
    myChart.destroy();
  }

  getData(); // グラフデータに値を格納
  drawChart(); // グラフを再描画

  console.log("drawed");
}

// グラフデータをyobu
function getData() {
  ListData = []; // 配列を初期化
  let todoCount = listTodo.children.length;
  let doingCount= listDoing.children.length;
  let  doneCount=  listDone.children.length;
  ListData= [doneCount, doingCount, todoCount];

  console.log(ListData);
}

function drawChart() {
    var ctx = document.getElementById('progress-chart').getContext('2d');
    
    window.myChart = new Chart(ctx, { // インスタンスをグローバル変数で生成
        type: 'doughnut',
        data: {
            labels: ['完了タスク','作業中タスク', '未完了タスク'],
            datasets: [{
                data: ListData, // グラフデータ
                backgroundColor: ['#00bfff', '#00ff7f', '#ff6347']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
  }


  
/* Function to update the chart
function updateChart() {
    //タスク表の子要素の長さ(数)を取得
    let todoCount = listTodo.children.length;
    let doingCount = listDoing.children.length;
    let doneCount = listDone.children.length;

    //円グラフの中身に数を代入
    progressChart.data.datasets[0].data = [doneCount, doingCount, todoCount];
    progressChart.update();
}*/

/* Function to render list-todos in the lists　タスクを表示
function renderlist-todos() {
    //list-todosに入った情報を



    //グラフも更新しとく
    updateChart();
}
*/


//追加機能 listの末尾に追加するタスクが入る
/*function addTask(list,task){//list-todos.todo,task
    //li要素を新生成
    const listItem = document.createElement('li');
    //中身を書き込む
    listItem.innerHTML = 
        `${task.name} - ${task.label} - ${task.priority} 
        <br> 
        ${task.deadline}
        <br>
        ${task.note} @ ${task.where}
    `;
    //リストの末尾に追加
    list.appendChild(listItem);
}*/

//ユーザーが入力したタスクをリストに追加し、入力フィールドをクリアする関数
function addTask() {
    // html.id => js.element
    const taskInput = document.getElementById("taskInput");
    let property = {
        name: taskInput.value.trim(),
        priority: document.getElementById('taskPriority').value,
        deadline: document.getElementById('taskTime').value,
        where: document.getElementById('taskLocation').value,
        label: document.getElementById('taskLabel').value,
        note: document.getElementById('taskDescription').value
    };

    // 
    if (property.name !== "") {  //空じゃない場合
        const li = document.createElement("li");//liを作る

        // spanを作って、中身を設定
        const span = document.createElement("span");
        span.textContent ="名前:" + property.name
                          +"\n期限" + property.deadline
                          +"\nラベル" + property.label
                          +"\n詳細" + property.note
                          +"\n優先度" + property.priority
                          +"\n場所" + property.where
                          ;
        // spanをクリックすると、タスクの完了状態が切り替わる
        span.addEventListener("click", () => {
            span.parentNode.classList.toggle("completed");
            saveTasks();  // タスクの状態を保存
        });


        // 削除ボタンを作成し、クリックするとタスクを削除するイベントリスナーを追加
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "削除";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => {
            li.remove();    //liの中身消す
            saveTasks();    //タスクの状態を保存
        });

        // li要素にspanと削除ボタンを追加し、それをlisttodoに追加
        li.appendChild(span);
        li.appendChild(deleteBtn);
        listTodo.appendChild(li);

        // 入力フィールドをクリアし、フォーカスを戻す
        taskInput.value = "";
        taskInput.focus();

        saveTasks();  // タスクの状態を保存

        logActivity(`Added task: ${property.name}`);
    }
}

// 現在のタスクリストをローカルストレージに保存する関数
function saveTasks() {
    const tasks = [];
    // すべてのli要素を取得し、タスクのテキストと完了状態を配列に保存
    document.querySelectorAll("#list-todo li").forEach(li => {
        tasks.push({
            text: li.querySelector("span").textContent,
            completed: li.classList.contains("completed")
        });
    });
    // タスクをJSON文字列に変換し、ローカルストレージに保存
    localStorage.setItem("tasks", JSON.stringify(tasks));
    logActivity(`Saved task`);

}
// ローカルストレージからタスクを読み込み、表示する関数
function loadTasks() {
    // ローカルストレージからタスクを取得し、オブジェクトに変換
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks) {
        tasks.forEach(task => {
            // 各タスクをli要素として作成し、タスクリストに追加
            const li = document.createElement("li");
            const span = document.createElement("span");
            span.textContent = task.text;
            // タスクが完了している場合、クラスを追加
            if (task.completed) {
                li.classList.add("completed");
            }
            // タスクの完了状態を切り替えるイベントリスナーを追加
            span.addEventListener("click", () => {
                span.parentNode.classList.toggle("completed");
                saveTasks();  // タスクの状態を保存
            });

            // 削除ボタンを作成し、タスクを削除するイベントリスナーを追加
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "削除";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.addEventListener("click", () => {
                li.remove();
                saveTasks();  // タスクの状態を保存
            });

            // li要素にspanと削除ボタンを追加し、それをlist-todoに追加
            li.appendChild(span);
            //li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            document.getElementById("list-todo").appendChild(li);
        });
    }

    logActivity(`Loaded task`);
}


/* Move task between columns
function moveTask(taskName, targetList) {//property.name ,list-todo
    let task = list-todos.todo.find(t => t.name === taskName) || list-todos.doing.find(t => t.name === taskName);

    if (targetList === 'todo') {
        list-todos.todo = list-todos.todo.filter(t => t.name !== taskName);
        list-todos.doing.push(task);
    } else if (targetList === 'doing') {
        list-todos.doing = list-todos.doing.filter(t => t.name !== taskName);
        list-todos.done.push(task);
    }

    logActivity(`Moved task: ${taskName} to ${targetList}`);
}*/

/* Remove task
function removeTask(taskName) {
    list-todos.todo = list-todos.todo.filter(t => t.name !== taskName);
    list-todos.doing = list-todos.doing.filter(t => t.name !== taskName);
    list-todos.done = list-todos.done.filter(t => t.name !== taskName);
    logActivity(`Deleted task: ${taskName}`);
}*/







// Activity log function
function logActivity(action) {
    const log = `${new Date().toLocaleString('ja-JP')}: ${action}`;
    activityLog.push(log);
    const activityLogElement = document.getElementById('activityLog');
    const logElement = document.createElement('li');
    logElement.textContent = log;
    activityLogElement.appendChild(logElement);
}

// ページの読み込みが完了したときにタスクを読み込むイベントリスナーを設定
document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
});
