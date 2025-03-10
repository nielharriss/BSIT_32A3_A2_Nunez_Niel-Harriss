document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const sortSelect = document.getElementById('sortSelect');

    loadTasks();

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    sortSelect.addEventListener('change', renderTasks);

    function addTask() {
        const taskText = taskInput.value.trim();
        const dueDate = dueDateInput.value;

        if (taskText === '') {
            alert('Task cannot be empty!');
            return;
        }

        let priority;
        while (true) {
            priority = prompt('Enter priority (high, medium, low):', 'medium');
            if (!priority) return; // If user cancels, exit
            priority = priority.toLowerCase();
            if (['high', 'medium', 'low'].includes(priority)) break;
            alert('Invalid priority! Please enter high, medium, or low.');
        }

        const task = { text: taskText, done: false, priority, dueDate };
        saveTask(task);
        taskInput.value = '';
        dueDateInput.value = '';
    }

    function saveTask(task) {
        const tasks = getTasks();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function getTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function renderTasks() {
        taskList.innerHTML = '';
        let tasks = getTasks();

        const sortOption = sortSelect.value;
        if (sortOption === 'priority') {
            tasks.sort((a, b) => ['high', 'medium', 'low'].indexOf(a.priority) - ['high', 'medium', 'low'].indexOf(b.priority));
        } else if (sortOption === 'dueDate') {
            tasks.sort((a, b) => new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31'));
        }

        tasks.forEach((task, index) => {
            const listItem = document.createElement('li');
            listItem.className = `list-group-item d-flex justify-content-between align-items-center ${isOverdue(task.dueDate) ? 'text-danger' : ''}`;
            listItem.innerHTML = `
                <span class="task-text ${task.done ? 'text-decoration-line-through' : ''}">
                    ${task.text} (Priority: ${task.priority}) - Due: ${task.dueDate || 'No due date'}
                </span>
                <div>
                    <button class="btn btn-sm btn-warning edit-button">Edit</button>
                    <button class="btn btn-sm btn-success done-button">${task.done ? 'Undo' : 'Done'}</button>
                    <button class="btn btn-sm btn-danger delete-button">Delete</button>
                </div>
            `;

            listItem.querySelector('.done-button').addEventListener('click', () => toggleDone(index));
            listItem.querySelector('.delete-button').addEventListener('click', () => deleteTask(index));
            listItem.querySelector('.edit-button').addEventListener('click', () => editTask(index));

            taskList.appendChild(listItem);
        });
    }

    function toggleDone(index) {
        const tasks = getTasks();
        tasks[index].done = !tasks[index].done;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function deleteTask(index) {
        const tasks = getTasks();
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function editTask(index) {
        const tasks = getTasks();
        const newText = prompt('Edit task:', tasks[index].text);
        if (newText && newText.trim() !== '') {
            tasks[index].text = newText.trim();
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        }
    }

    function isOverdue(dueDate) {
        return dueDate && new Date(dueDate) < new Date();
    }

    function loadTasks() {
        renderTasks();
    }
});
