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
    		this.navigateToList(parentContainer);
    	} 	
    },
    
    navigateToContainer: function(options) {
    	var that = this;
    	var containerId = options.containerId;
    	
    	if(containerId == 0) {
			this.index();    	
    	} else {    	
	    	var Container = Ext.ModelMgr.getModel('Container');
	    	
	    	Container.load(containerId, {
	    		success: function(container, operation) {
		    		that.list({parentContainer: container})
	    		},
	    		failure: function(container, operation) {
	    			Ext.Msg.alert('Alert', 'Unable to navigate to the selected item.', Ext.emptyFn);
	    		}
	    	});
	    }
    },
    
    navigateToList: function(selectedList) {
    	HubList.viewport.removeContainersList();
    	Ext.dispatch({controller: 'tasks', action: 'list', list: selectedList});
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