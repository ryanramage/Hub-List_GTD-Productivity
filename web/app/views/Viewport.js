HubList.Viewport = Ext.extend(Ext.Panel, {

    initComponent: function() {
        Ext.apply(this, {
            id: 'viewport',
            fullscreen: true,
            layout: 'card',
            scroll: 'vertical',
             dockedItems: [{
            	dock: 'top',
            	id: 'viewportTopToolbar',
                xtype: 'toolbar',
                title: 'Hub List'
            },
            {
            	dock: 'bottom',
            	xtype: 'tabbar',
           	    cls: 'hl-bot-tbar',
            	defaults: {
            		iconAlign: 'top',
            		iconMask: true
            	},
            	layout: {pack:'center'}, 
            	ui:'light',
	            items: [{
		        		text: 'Home',
		        		iconCls	 : 'home'
		    		},
		    		{                      
		        		xtype: 'spacer',
		        		flex: 1
		    		},
		    		{
		        		text     : 'Settings',
						iconCls	 : 'settings'
		    		},
		    		{
		    			text: 'New',
		    			iconCls: 'add'
		    		}
		    	]
		    }]
	
        });
    
        HubList.Viewport.superclass.initComponent.apply(this, arguments);
    },
    
    updateTbarBackButton: function(itemId, btnLabel) {
    	var topToolbar = this.getDockedComponent('viewportTopToolbar');
    	var existingBackBtn = topToolbar.getComponent('vpTbarBackBtn');
    	
    	if(existingBackBtn) {
    		existingBackBtn.setText(btnLabel);
    		existingBackBtn.navId = itemId;
    	} else {
    		var containersController = Ext.ControllerManager.get('containers');
	    	var newBackBtn = new Ext.Button({
	    		id: 'vpTbarBackBtn',
	    		navId: itemId,
	    		ui: 'back',
	    		text: btnLabel || 'Back',
	    		listeners: {
	    			'tap': function(btn, eventObj) {
	    				Ext.dispatch({
	    					controller: 'containers',
	    					action: 'navigateToContainer',
	    					containerId: btn.navId
	    				});
            		}
	    		}
	    	});
	    	
    		topToolbar.add(newBackBtn);
    	}

   		topToolbar.doComponentLayout();
    },
    
    removeTbarBackButton: function() {
    	var topToolbar = this.getDockedComponent('viewportTopToolbar');
    	var existingBackBtn = topToolbar.getComponent('vpTbarBackBtn');
    	
    	if(existingBackBtn) {
    		existingBackBtn.destroy();
    	}
    },
    
    removeContainersList: function() {
    	var items = this.query('.containerslist');
    	if(items.length) {
    		items[0].destroy;
    	}
    }
});