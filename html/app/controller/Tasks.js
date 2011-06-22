Ext.define('HL.controller.Tasks', {
    extend: 'Ext.app.Controller',
              
    refs: [
        {
            ref: 'taskTree',
            selector: 'tasktree'
        }, {
            ref: 'mainPanel',
            selector: 'viewport > #mainCenterPanel'
        }, {
            ref: 'containerTree',
            selector: 'containertree'
        }
    ],
    
    init: function(app) {
        this.control({
            'tasktree': {
                itemdblclick: this.taskDblClick
            },
            'tasktree toolbar #newTaskBtn': {
                click: function() {
                    // this approach gets rid of arguments
                    // passed in from clicking the button
                    this.showNewTaskWindow();
                }
            }            
        });        
        
        app.addListener({'listselect': this.onListSelect, scope: this});
    },
    
    onListSelect: function(treeView, list, selections, options) {                
        var mainPanel = this.getMainPanel();
        var taskTree = this.getTaskTree();
        listClone = list.copy();
        
        if(taskTree) {
            var tasksStore = taskTree.getStore();
            listClone.data.loaded = false;
            listClone.data.expanded = true;
            tasksStore.setRootNode(listClone);
        } else {
            var taskTree = Ext.create('HL.view.task.Tree', {rootList:listClone});
            taskTree.setTitle(listClone.get('name'));
            mainPanel.add(taskTree);
        }
    },
    
    taskDblClick: function(tree, node, itemEl, itemIndex, eventObj) {
        this.showNewTaskWindow(node);
    },    
    
    showNewTaskWindow: function(task) {
        var ntw = Ext.create('HL.view.task.NewTaskWindow');
        if(task && task.isNode) {
            ntw.setTitle('Edit Task');
            ntw.loadRecord(task);
        }
        ntw.show();    
    },
      
    updateTaskTreeTitle: function() {
        var taskTree = this.getTaskTree();
        if(taskTree) {
            taskTree.setTitle(Ext.StoreManager.lookup('tasksStore').getRootNode().get('name'));
        }
    } 


});      
        