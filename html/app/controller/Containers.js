Ext.define('HL.controller.Containers', {
    extend: 'Ext.app.Controller',
              
    refs: [
        {
            ref: 'containerTree',
            selector: 'containertree'
        }
    ],      
          
    init: function(app) { 
        this.control({
            'containertree': {
                itemdblclick: this.containerDblClick,
                selectionchange: this.containerSelectionChange
            },
            'containertree toolbar #newContainerBtn': {
                click: function() {
                    // this approach gets rid of arguments
                    // passed in from clicking the button
                    this.showNewContainerWindow();
                }
            },
            'newcontainerwindow': {
                savenewcontainer: this.saveNewContainer
            }    
        });
        
        app.addListener({'refreshcontainers': this.refreshContainers, scope: this});
    },
    
    containerSelectionChange: function(treeView, selections, options) {
        var node = selections[0];
        var nodeType = node.get('type');
        if(nodeType === 'list' || nodeType === 'folder') {
            var eventName = nodeType + 'select';
            this.application.fireEvent(eventName, treeView, node, selections, options);        
        }
    },
    
    containerDblClick: function(tree, node, itemEl, itemIndex, eventObj) {
        this.showNewContainerWindow(node);
    },
    
    refreshContainers: function() {
        this.getContainerTree().getStore().load();
    },
    
    showNewContainerWindow: function(container) {
        var ncw = Ext.create('HL.view.container.NewContainerWindow');
        if(container && container.isNode) {
            ncw.setTitle('Edit Task Container');
            ncw.loadRecord(container);
        }
        ncw.show();
    }
})