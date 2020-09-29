/**
 * You have to create a task manager consisting of servers and tasks.
What is a server?
A server is a program that executes a task. Here, one server can perform only one task at a
time.

What is a task?

A task is a piece of work to be done. Here a task will be presented by a linear progress bar that
fills itself completely in 20 seconds. A timer will be running beside the task to show the time left
to complete it.

The system will have the following functionalities:

Add a server: The system will start with only 1 server and more servers can be added using the
"Add a server" button. The system can have a minimum of 1 server & a maximum of 10 servers
running simultaneously.

Remove a server: An idle server can be removed from the system by pressing the "Remove a
server" button. If a server is not performing any task it will be removed immediately, however, if
a server is doing a job it'll be removed after completing the job.

Add tasks: The system will start with 0 tasks. N number of tasks can be added to the task
queue by entering N and pressing the "Add tasks" button.

Task execution: A task starts immediately if there is a server available. If the server is not
available, the task gets added to the task queue. A task that has not started yet can be removed
by pressing a delete button. A task in the progress can't be removed or stopped.
 */


//BusinessLogic Controller

var BusinessLogicController = (function () {

    // Server Function Constructor
    var Server = function (serverNumber, taskAllocated) {

        this.serverNumber = serverNumber;
        this.taskAllocated = taskAllocated;

    }
    // Task Function Constructor

    var Task = function (taskCount) {

        this.taskCount = taskCount;

    }
    var data = {
        allItems: {
            server: [],
            task: []
        },
        total: {
            serverCnt: 0,
            taskCnt: 0
        }
    }

    var updateServerCount = function (count) {
        data.total.serverCnt += count;
    };

    var updateTaskCount = function (count) {
        data.total.taskCnt += count;
    };

    return {
        addItems: function (previousCount, count, type) {
            var newItem, en_count;
            // To Add server
            if (type === 'server') {

                if (BusinessLogicController.getTaskCount() > 0) {
                    updateServerCount(count);
                    let value = data.allItems['task'].shift();
                    UIController.showProgressOfTask(value.taskCount);
                    newItem = new Server(previousCount, value.taskCount);
                    data.allItems[type].push(newItem);
                } else {
                    alert("Please add atleast one task");
                }
            }
            //To add Task
            else if (type === 'task') {
                updateTaskCount(count);
                console.log("count>>>", count);
                for (let i = previousCount; i < (previousCount + count); i++) {
                    newItem = new Task(i);
                    data.allItems[type].push(newItem);
                }
            }
            // return newItem;
        },
        getServerCount: function () {
            return data.total.serverCnt;
        },

        getTaskCount: function () {
            return data.total.taskCnt;
        },
        testing: function () {
            return data;
        }

    }

})();




// UI Controller
var UIController = (function () {

    var DOMstrings = {
        inputType: '.add_server',
        removeServer: '.remove_server',
        addtask: '.add_task',
        progressbar: '.progress_bar',
        addvalue: '.add__value',
        servercount: '.server_count'
    };

    var removeTaskdiv = function(i){

        document.querySelector(".delete_"+i).addEventListener('click',()=>{
            document.querySelector(".parent_"+i).remove();
           let data = BusinessLogicController.testing();
           data = data.allItems['task'].splice(i,1);
        })
    }


    return {
        getDOMstrings: function () {
            return DOMstrings;
        },
        addTask: function (previousCount, currentCount) {
            var html, element, serverCount;

            console.log("previousCount>>>>", previousCount, "currentCount>>>>>>", currentCount);
            element = DOMstrings.progressbar;
            for (let i = previousCount; i < (currentCount + previousCount); i++) {
                html = '<div class="d-flex parent_%id%" style="flex-direction:row,justify-content:space-between"><div class="bar_%id%" id="my_bar">waiting</div><div class="delete_%id%"><button type="button"  class="btn btn-link">Delete</button></div></div>';
                //Replace the placeholder text with actual data
                newHtml = html.replace('%id%', i);
                newHtml = newHtml.replace('%id%', i);
                newHtml = newHtml.replace('%id%', i);
                //Insert the HTML into the DOM
                document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
                removeTaskdiv(i);
            }
            
        },
        getTaskValue: function () {

            var html, element, inputValue;

            inputValue = document.querySelector(DOMstrings.addvalue).value;
            document.querySelector(DOMstrings.addvalue).value = "";
            if (Number(inputValue) > 0) {
                return Number(inputValue);
            }
            else {
                alert("Please Enter number of task to be added in queue.");
            }


            return 0;
        },
        addSever: function () {

            document.querySelector(DOMstrings.servercount).innerHTML = BusinessLogicController.getServerCount();

        },
        showProgressOfTask: function (index) {
            var elem = document.querySelector(".bar_" + index);
            elem.style.width = '10%';
            elem.style.backgroundColor = "#4CAF50";
            elem.style.textAlign = 'center';
            elem.style.lineHeight = '30px';
            elem.style.color = 'white';
            elem.style.border = '1px solid grey';
            var width = 10;
            var id = setInterval(frame, 20);
            console.log("id>>", id);
            function frame() {
                if (width >= 100) {
                    clearInterval(id);
                    i = 0;
                    document.querySelector(".delete_" + index).remove();
                    // BusinessLogicController.testing();
                } else {
                    width++;
                    elem.style.width = width + "%";
                    elem.innerHTML = width + "%";
                }
            }
        },


    }



})();





// App Controller
var AppController = (function () {

    var setEventListeners = function () {

        var DOM = UIController.getDOMstrings();
        document.querySelector(DOM.inputType).addEventListener('click', ctrlServer);
        document.querySelector(DOM.addtask).addEventListener('click', ctrlTask);
        document.querySelector(DOM.removeServer).addEventListener('click', ctrlRemoveServer);
    };

    var ctrlServer = function ($event) {
        var type, serverCount, newItem;
        console.log("event in add>>", $event);
        type = $event.srcElement.classList[2].split("_")[1];
        serverCount = BusinessLogicController.getServerCount();
        console.log("serverCount>>", serverCount);
        BusinessLogicController.addItems(serverCount, 1, type);

        UIController.addSever();

        $event.stopPropagation();
    };
    var ctrlTask = function ($event) {

        var type, taskCount, newItem, previousCount;
        console.log("event in add>>", $event);
        type = $event.srcElement.classList[2].split("_")[1];
        taskCount = UIController.getTaskValue();
        if (taskCount > 0) {

            previousCount = BusinessLogicController.getTaskCount();
            console.log("previousCount>>>", previousCount);
            BusinessLogicController.addItems(previousCount, taskCount, type);
            // console.log("newItem>>>",newItem);
            UIController.addTask(previousCount, taskCount);
        }


        $event.stopPropagation();
    };
    var ctrlRemoveTask = function ($event) {

        console.log("event in remove task>>", $event);

        $event.stopPropagation();
    };
    var ctrlRemoveServer = function ($event) {
        console.log("event in delete>>", $event);
        $event.stopPropagation();
    };

    return {
        init: function () {
            console.log("Application has started");

            setEventListeners();
        }
    }


})(BusinessLogicController, UIController);

AppController.init();