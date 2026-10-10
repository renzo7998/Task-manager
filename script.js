var taskinput = document.querySelector("#task-input");
var addtaskbtn = document.querySelector("#add-task-btn");
var tasklist = document.querySelector("#task-list");
var taskcount = document.querySelector("#task-count");
var completecount = document.querySelector("#complete-task");
var clearbtn = document.querySelector("#clear-all-btn");
var allbtn = document.querySelector("#all-btn");
var activebtn = document.querySelector("#active-btn");
var completedBtn = document.querySelector("#completed-btn");
var emptymsg = document.querySelector("#empty-message");
var themebtn = document.querySelector("#theme-btn");
var priority = document.querySelector("#task-priority");
var deadline = document.querySelector("#task-deadline");
var searchinput = document.querySelector("#search-input");
var  tasknumber = 0;
var completednumber = 0;
var tasks = [];

function createtask(task){
       var taskitem = document.createElement("p");
       taskitem.dataset.task = task.text;
       var deletebtn = document.createElement("button");
       var completebtn = document.createElement("button");
       var editbtn = document.createElement("button");
       var actionsbox = document.createElement("div");
       var togglebtn = document.createElement("button");

       actionsbox.classList.add("task-actions");
       togglebtn.classList.add("toggle-actions");

       togglebtn.textContent = "⋮";
       togglebtn.type = "button";

       actionsbox.style.display = "none";
       var editbox = document.createElement("span");
       var editinput = null;
       var prioritybox = document.createElement("span");
       var deadlinebox = document.createElement("span");
       deadlinebox.classList.add("deadline-box");



       editbtn.textContent = "🖋️";
       completebtn.textContent = "✅";
       deletebtn.textContent = "🗑️";
       editbox.textContent = task.text;
       prioritybox.textContent = task.priority;
if (task.deadline) {
    var date = new Date(task.deadline);

    var formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short"
    });

    var formattedTime = date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });

    deadlinebox.textContent = "📅 " + formattedDate + ", " + formattedTime;
} else {
    deadlinebox.textContent = "";
}
       

       if (task.completed){
        taskitem.classList.add("completed");
        task.completed = true;
        completednumber++;
        updatecompletecount();
       } else {
        task.completed = false;
       }
      
       

       taskitem.appendChild(editbox);   
       taskitem.appendChild(prioritybox);
        if (task.priority === "high") {
           prioritybox.textContent = "🔴";
       }
        else if (task.priority === "medium") {
           prioritybox.textContent = "🟡";
       }
         else if (task.priority === "low") {
           prioritybox.textContent = "🟢";
        }
        taskitem.appendChild(deadlinebox);

       actionsbox.appendChild(editbtn);
   
       actionsbox.appendChild(completebtn);
       actionsbox.appendChild(deletebtn);

       taskitem.appendChild(togglebtn);
       taskitem.appendChild(actionsbox);
      

       togglebtn.addEventListener("click", function(){
        if (actionsbox.style.display === "none") {
            actionsbox.style.display = "flex";
            togglebtn.textContent = "×";
        } else {
            actionsbox.style.display = "none";
            togglebtn.textContent = "⋮";
        }
       });


        editbtn.addEventListener("click", function(){
         if (editinput) {
            return;
         }

         editinput = document.createElement("input");
         editinput.value = editbox.textContent;
         taskitem.appendChild(editinput);

         var savebtn = document.createElement("button");
         savebtn.textContent = "🗃️";
         taskitem.appendChild(savebtn);
       
         savebtn.addEventListener("click",function(){
         var newtext = editinput.value.trim();
         if (newtext) {
            editbox.textContent = newtext;
            task.text = newtext;
            localStorage.setItem("tasks", JSON.stringify(tasks));
         }
         
         editinput.remove();
         savebtn.remove();

         editinput = null;
          });
          
       });
   
       completebtn.addEventListener("click", function(){
        taskitem.classList.toggle("completed");
        if ( taskitem.classList.contains("completed")){
            task.completed = true;
            completednumber++;
            updatecompletecount(); 
        } else {
            task.completed = false;
            completednumber--;
            updatecompletecount();
        }
        localStorage.setItem("tasks", JSON.stringify(tasks));

       });
       deletebtn.addEventListener("click", function() {
        taskitem.classList.add("task-removing");

        if (taskitem.classList.contains("completed")) {
            completednumber--;
            updatecompletecount();
        }


        var index = tasks.indexOf(task);
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));

        tasknumber--;
        updatetaskcount();

        if (tasknumber === 0) {
            emptymsg.style.display = "block";
        }

        setTimeout(function(){
            taskitem.remove();
        }, 500);
       });

      
       tasklist.appendChild(taskitem);

       tasknumber++;
       updatetaskcount();
    }
 function filtertasks(filter) {
    var alltasks = document.querySelectorAll(
        "#task-list p:not(#empty-message)"
    );

    var searchtext = searchinput.value.toLowerCase().trim();

    alltasks.forEach(function(taskitem) {
        var tasktext = taskitem.dataset.task.toLowerCase();
        var completed = taskitem.classList.contains("completed");

        var matchesSearch = tasktext.includes(searchtext);

        var matchesFilter =
            filter === "all" ||
            (filter === "active" && !completed) ||
            (filter === "completed" && completed);

        if (matchesSearch && matchesFilter) {
            taskitem.style.display = "flex";
        } else {
            taskitem.style.display = "none";
        }
    });
    
}
searchinput.addEventListener("input", function() {
    var activefilter = "all";

    if (activebtn.classList.contains("active-filter")) {
        activefilter = "active";
    } else if (completedBtn.classList.contains("active-filter")) {
        activefilter = "completed";
    }

    filtertasks(activefilter);
});
allbtn.addEventListener("click", function(){
    filtertasks("all");

    allbtn.classList.add("active-filter");
    activebtn.classList.remove("active-filter");
    completedBtn.classList.remove("active-filter");
});
activebtn.addEventListener("click", function(){
    filtertasks("active");

    activebtn.classList.add("active-filter");
    allbtn.classList.remove("active-filter");
    completedBtn.classList.remove("active-filter");
});
completedBtn.addEventListener("click", function(){
    filtertasks("completed");

    completedBtn.classList.add("active-filter");
    allbtn.classList.remove("active-filter");
    activebtn.classList.remove("active-filter");
});
themebtn.addEventListener("click", function(){
    document.body.classList.toggle("light-mode");
    if (document.body.classList.contains("light-mode")){
        themebtn.textContent = "🌙  Dark Mode";
    }else{
        themebtn.textContent = "☀️ Light Mode";
    }
    localStorage.setItem("theme", document.body.classList.contains("light-mode"));
   
})


addtaskbtn.addEventListener("click", function() {
   var tasktext = taskinput.value.trim();

   if (tasktext) {
      emptymsg.style.display = "none";

    var task = {
      text: tasktext,
      completed: false,
      priority: priority.value,
      deadline: deadline.value
      
};
   
       
       tasks.push(task);
       localStorage.setItem("tasks", JSON.stringify(tasks));

       createtask(task);

       taskinput.value = "";
    }
});

taskinput.addEventListener("keydown", function(event){
    if (event.key === "Enter") {
        addtaskbtn.click();
    }
});

function updatetaskcount() {
    taskcount.textContent = "Tasks: " + tasknumber;

    taskcount.style.transform = "scale(1.15)";

    setTimeout(function() {
        taskcount.style.transform = "scale(1)";
    }, 200);
}

function updatecompletecount() {
    completecount.textContent = "Completed: " + completednumber;
        completecount.style.transform = "scale(1.15)";

    setTimeout(function(){
        completecount.style.transform = "scale(1)";
    }, 200);
}

clearbtn.addEventListener("click", function(){
    tasklist.innerHTML = `
        <p id="empty-message">📝 No tasks yet. Add your first to get started.</p>
    `;

    emptymsg = document.querySelector("#empty-message");

    tasks = [];
    localStorage.removeItem("tasks");

    tasknumber = 0;
    completednumber = 0;

    updatetaskcount();
    updatecompletecount();
});

var savedtasks = localStorage.getItem("tasks");
tasks  = savedtasks ? JSON.parse(savedtasks) : [];

if (tasks.length > 0) {
    emptymsg.style.display = "none";
}
var savetheme = localStorage.getItem("theme");

if (savetheme === "true") {
    document.body.classList.add("light-mode");
    themebtn.textContent = "🌙 Dark Mode";
} else {
    document.body.classList.remove("light-mode");
    themebtn.textContent = "☀️ Light Mode";
}

tasks.forEach(function(task) {
   createtask(task);
}); 
allbtn.classList.add("active-filter");
