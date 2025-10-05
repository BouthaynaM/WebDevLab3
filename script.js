document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Render existing tasks
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            createTaskElement(task, index);
        });
    }

    // Create new task element
    function createTaskElement(task, index) {
        // Input validation - skip if task text is empty after trimming
        if (!task.text || task.text.trim() === '') {
            return;
        }

        // Trim whitespace from task text
        task.text = task.text.trim();

        const li = document.createElement('li');
        li.className = 'task-item';
        li.setAttribute('role', 'listitem');

        const taskText = document.createElement('span');
        taskText.className = `task-text ${task.completed ? 'completed' : ''}`;
        taskText.textContent = task.text;

        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn';
        completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
        completeBtn.setAttribute('aria-label', `${task.completed ? 'Mark as incomplete' : 'Mark as complete'}`);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.setAttribute('aria-label', 'Delete task');

        completeBtn.addEventListener('click', () => toggleComplete(index));
        deleteBtn.addEventListener('click', () => deleteTask(index));

        li.appendChild(taskText);
        li.appendChild(completeBtn);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    }

    // Add new task
    function addTask(text) {
        tasks.push({ text, completed: false });
        saveTasks();
        renderTasks();
    }

    // Delete task
    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    // Toggle task completion
    function toggleComplete(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Form submit handler
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (text) {
            addTask(text);
            taskInput.value = '';
        }
    });

    // Initial render
    renderTasks();

    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterType = button.getAttribute('data-filter');
            filterTasks(filterType);
        });
    });

    function filterTasks(filterType) {
        const tasks = document.querySelectorAll('.task-item');
        
        tasks.forEach(task => {
            const isCompleted = task.querySelector('input[type="checkbox"]').checked;
            task.classList.remove('hidden');
            
            if (filterType === 'completed' && !isCompleted) {
                task.classList.add('hidden');
            } else if (filterType === 'pending' && isCompleted) {
                task.classList.add('hidden');
            }
        });
    }
});