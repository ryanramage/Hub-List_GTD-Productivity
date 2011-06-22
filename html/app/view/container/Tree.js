Ext.define('HL.view.container.Tree', {
    requires: ['HL.store.Containers', 'HL.view.container.NewContainerWindow', 'HL.view.container.dd.TreeViewDragDrop'],

    extend: 'Ext.tree.Panel',
    alias: 'widget.containertree',
    
    id: 'containerTreePanel',
    title: 'Folders',
    
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
                id: 'newContainerBtn',
                text: '+'
            }]
        }],
        listeners: {
            itemmove: function(node, oldParent, newParent, newIndex, options) {
                var containerStore = this.getStore();
                var upRecs = containerStore.getUpdatedRecords();
                var pause = '';
            },
            load: function(store, record, records, success, options) {
                // this is a temporary solution to select the first
                // list in the tree, eventually we'll select whatever
                // was previously selected by maintaining proper component states
                if(success && records.length > 0) { 
                    var topNode = store.getRootNode().childNodes[0];
                    if(topNode.get('type') === 'list') {
                        this.getView().select(topNode);                    
                    } else {
                        // assume the first child is a list
                        // todo: properly loop through children 
                        // recursively until we find a list
                        topNode.expand();
                        this.getView().select(topNode.childNodes[0]);
                    }
                }
            }
        }
    },
    
    viewConfig: {
        plugins: {
            ptype: 'ctreeviewdragdrop',
            ddGroup: 'local-containers',
            allowParentInsert: true
        }
    },
    
    constructor: function(config) {
        this.initConfig(config);      
        return this.callParent(arguments);
    },

    initComponent: function() {       
        this.store = Ext.create('HL.store.Containers');
        this.callParent(arguments);
    },
    
    selectFirstList: function(startNode) {
        var me = this;
        startNode = startNode || me.getStore().getRootNode();
        
        if(startNode.hasChildNodes()) {
            startNode.eachChild(function(node) {
                if(node.hasChildNodes) {
                    me.selectFirstList(node);                 
                }
            }, me);
        }        
    }
    

});