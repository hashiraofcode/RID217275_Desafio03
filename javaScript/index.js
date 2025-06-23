// função que pega as tarefas do localStorage e fornece elas para serem renderizadas;
const getTasksFromLocalStorage = () => {
    const StorageData = window.localStorage.getItem("tasks");
    const Data = StorageData?
    JSON.parse(StorageData):
    [];
    return Data;
}
let tasksData = getTasksFromLocalStorage();
// função que define as tarefas no local Storage;
const setTasksInLocalStorage = (arrayTasks) => {
    const formatData = JSON.stringify(arrayTasks);
    window.localStorage.setItem("tasks", formatData);
}
// função que remove as tarefas concluídas;
const removeTaskFinalizad = () => {
    const itensToRemove = tasksData.filter(({checked}) => checked);
    itensToRemove.forEach((tasks) => {
        const li = document.getElementById(String(tasks.id));
        document.getElementById("wrapper-tasks")
        .removeChild(li);
    })
    tasksData = tasksData.filter(({checked}) => !checked);
    setTasksInLocalStorage(tasksData);
}
// função que pega a data do dia;
const dateToDay = () => {
    const toDay = new Date();
    const dateBRFormat = toDay.toLocaleDateString("pt-BR")
    return dateBRFormat;
}
// função que gera um novo id;
const getNewId = () => {
    const lastId = tasksData[tasksData.length -1]?.id;
    const nextId = lastId? lastId + 1 : 1;
    return nextId
}
// função que pega a descrição, etiqueta, id da nova task;
const newTaskData = () => {
    // pegando descrição
    const taskValue = document.getElementById("description")
    const description = taskValue.value;
    // pegando etiqueta
    const labelValue = document.getElementById("label");
    const etiqueta = labelValue.value;
    // gerando id;
    const id = getNewId();
    return {description, etiqueta, id};
}
// função que cria a nova tarefa
const setNewTaskInList = (event) => {
    event.preventDefault()
    // testando se digitou algo valido no form;
    const {description,etiqueta} = newTaskData();
    if (description != "" && etiqueta != "") {
    const {description,etiqueta,id} = newTaskData();
    const objectValues = {};
    objectValues.description = description;
    objectValues.label = etiqueta;
    objectValues.id = id;
    objectValues.checked = false;
    const newTaskItem = newTaskContent(objectValues);
    setTasksInDisplay(newTaskItem);
    tasksData.push(objectValues);
    setTasksInLocalStorage(tasksData);
    document.getElementById("toDo-form").reset()
    } else {
        alert("Insira uma Tarefa ou Etiqueta válida");
    }
}
// função que coloca o concluido na task e estila o elemento;
const setTaskTrue = (elementId) => {
    const checkbox = document.getElementById(elementId);
    checkbox.checked = true;
    const id = elementId.split("-")[0];
    // atualizando o elemento no array;
    tasksData = tasksData.map((task) => {
        if( task.id == id) {
            return {...task, checked: true};
        } else {
            return task;
        }
    });
    setTasksInLocalStorage(tasksData);
}
// função que tira o concluido da task e estila o elemento;
const setTaskFalse = (elementId) => {
    const checkbox = document.getElementById(elementId);
    checkbox.checked = false;
    const id = elementId.split("-")[0];
    // atualizando o elemento no array;
    tasksData = tasksData.map((task) => {
        if( task.id == id) {
            return {...task, checked: false};
        } else {
            return task;
        }
    });
    console.log(tasksData);
}
// função que cria todo o contéudo da task;
const newTaskContent = (ArrayTasks) => {
    const Content = document.createElement("p");
    const awesomeElement = document.createElement("i");
    const wrapperConcluido = document.createElement("div");
    const wrapperChecked = document.createElement("div");
    const buttonConcluir = document.createElement("button");
    const checkbox = document.createElement("input");
    const etiqueta = document.createElement("span");
    const wrapper = document.createElement("div");
    const taskName = `${ArrayTasks.id}-checkbox`;
    const wrapperData =  document.createElement("p");
    const id = ArrayTasks.id;
    const data = dateToDay();
    //configurando elementos;
    Content.textContent = ArrayTasks.description;
    Content.ariaLabel = "tarefa";
    checkbox.type = "checkbox";
    checkbox.checked = ArrayTasks.checked;
    checkbox.id = taskName;
    awesomeElement.classList.add("fa-solid","fa-check");
    wrapperConcluido.appendChild(awesomeElement);
    buttonConcluir.textContent = "concluir";
    buttonConcluir.onclick = () => {
        setTaskTrue(taskName);
    }
    etiqueta.textContent = ArrayTasks.label;
    wrapperData.classList.add("wrapper-data");
    wrapperData.textContent = `Criado em: ${data}`;
    // montando elemento final;
    wrapperChecked.appendChild(awesomeElement);
    wrapperChecked.classList.add("wrapper-checked");
    wrapperChecked.onclick = () => {
        setTaskFalse(taskName);
    }
    wrapperConcluido.appendChild(wrapperChecked);
    wrapperConcluido.appendChild(buttonConcluir);
    wrapperConcluido.classList.add("wrapper-concluido");
    wrapper.appendChild(checkbox);
    wrapper.appendChild(Content);
    wrapper.appendChild(etiqueta);
    wrapper.appendChild(wrapperConcluido);
    wrapper.appendChild(wrapperData);
    wrapper.classList.add("wrapper-values");
    //retornando elemento;
    return {wrapper, id};
}
// função que renderiza as tasks na tela;
const setTasksInDisplay = (taskContent) => {
    const elementTask = document.createElement("li")
    const {wrapper, id} = taskContent;
    elementTask.id = id;
    elementTask.appendChild(wrapper);
    document.getElementById("wrapper-tasks")
    .appendChild(elementTask);
}   

window.onload = () => {
    document.getElementById("button-form").addEventListener("click", setNewTaskInList)
    tasksData.forEach((tasks)=> {
        const wrapper = newTaskContent(tasks);
        setTasksInDisplay(wrapper);
    });
}