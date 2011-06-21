Ext.define('HL.view.task.Tree', {
    requires: ['HL.store.Tasks', 'HL.view.task.NewTaskWindow'],
    
    extend: 'Ext.tree.Panel',
    alias: 'widget.tasktree',
    
    id: 'taskTreePanel',
    title: 'Tasks',
    
    config: {
        rootVisible: false,
        bodyPadding: '6 0 0 0',
        displayField: 'name',
        lines: false,
        useArrows: true,
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: [{
                xtype: 'button',
                id: 'newTaskBtn',
                text: '+'
            }]
        }]
    },
    
    viewConfig: {
        plugins: {
            ptype: 'treeviewdragdrop',
            ddGroup: 'tasks',
            allowParentInsert: true
        }
    },    
    
    constructor: function(config) {
        this.initConfig(config);      
        return this.callParent(arguments);
    },

    initComponent: function() {       
        if(this.rootList) {
            this.rootList.data.loaded = false;
            this.rootList.data.expanded = true;
            this.store = Ext.create('HL.store.Tasks', {root: this.rootList});
        } else {
            this.store = Ext.create('HL.store.Tasks');
        }   

        this.callParent(arguments);
    } 
    
    

});