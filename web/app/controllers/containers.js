 /* @class containers
 * @extends Ext.Controller
 * 
 */
Ext.regController("containers", {
	defaultTarget: 'viewport',
        
    init: function() {   	
    	this.addEvents({
    		'display-container-list': true
    	});
    	
    	this.addListener({
    		'display-container-list': {
    			fn: this.onDisplayContainerList
    		},
    		scope: this
    	});
    },
    
    index: function() {
        // temporary hack to only load top level items
        // TODO find a better way
        HubList.stores.Containers.load({
			callback:function(records, operation, success) {
				HubList.stores.Containers.filter({property:'containerId', value:0});
			}
		});
                
        this.homeView = this.render({
            xtype: 'containerslist',
            listeners: {
            	scope: this,
            	'itemtap': function(listPanel, itemIndex, itemNode, eventObj) {
            		var selectedContainer = listPanel.getRecord(itemNode);
            		this.list({parentContainer:selectedContainer});
            	}
            }
        }, 'viewport');
        
        this.fireEvent('display-container-list', {});
    },
    
    list: function(options) {
    	var parentContainer = options.parentContainer;
    	
    	if(parentContainer.get('type') == 'folder') {
    		// make sure this container has items
    		var childStore = parentContainer.children();
    		var childStoreCount = parentContainer.children().getCount();
    		
    		if(parentContainer.children().getCount()  > 0) {
	    		this.homeView.bindStore(parentContainer.children()); 
	    	} else {
	    		// in the future will probably display a specific view for this
	    		Ext.Msg.alert('Alert', 'Empty container view will go here with prompt to add items.', Ext.emptyFn);
	    	}
	    	
	    	this.fireEvent('display-container-list', {parentContainer: parentContainer});
    	} else if(parentContainer.get('type') == 'list') {
    		// for now we just display an alert
    		Ext.Msg.alert('Alert', 'Coming soon, view list of tasks.', Ext.emptyFn);
    		// eventually pass control to tasks controller action maybe using dispatch
    		//Ext.dispatch({controller: 'tasks', action: 'list', list: parentContainer});
    	} 	
    },
    
    onDisplayContainerList: function(options) {
    	var parentContainer = options.parentContainer;
    	if(parentContainer && parentContainer.getId() !== 0) {
    		HubList.viewport.updateTbarBackButton(parentContainer.get('containerId'), 'Back');
    	} else {
    		HubList.viewport.removeTbarBackButton();
    	}
    }
});