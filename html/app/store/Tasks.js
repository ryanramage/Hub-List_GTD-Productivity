Ext.define('HL.store.Tasks', {
    extend: 'Ext.data.TreeStore',
    autoLoad: false,
    //autoSync: true, // this broken, not being passed along to NodeStore config
    id: 'tasksStore',       
         
    model: 'HL.model.Task',
    root: {
        leaf: true, // initial loading of data only works when this is true (might be a bug?)
        expanded: true, // needed for initial data loading (seems counter intuitive)
        parentId: null
    },
    nodeParam: 'key',
    
    listeners: {
        beforesync: function(records, options) {
            var pause = '';
        },
        datachanged: function(store, options) {
            var updatedRecs = store.getUpdatedRecords();
            updatedRecs.forEach(function(rec, index, allItems) {
                if(rec.isRoot()) {
                    // update 
                    var pause = '';
                }
            });
            var pause = '';
        },
        load: function(store, records, success, options) {
            var pause = '';
        },
        move: function(tree, node, oldParent, newParent, index, options) {
            var updatedRecords = this.getUpdatedRecords();
            if(updatedRecords && updatedRecords.length > 0) {
                this.sync();
            }
        },
        remove: function(tree, parentNode, node, options) {
            var updatedRecs = Ext.data.StoreManager.lookup('tasksStore').getUpdatedRecords();
            var pause = '';
        },
        rootchange: function(record, options) {
            HL.app.getController('HL.controller.Tasks').updateTaskTreeTitle();
        },
        update: function(store, record, operation) {
            var updatedRecs = store.getUpdatedRecords();
            var rawRecs = operation.records;
            var opsRecs = operation.getRecords();
            var pause = '';
        },        
        write: function(store, operation) {
            var updatedRecs = store.getUpdatedRecords();
            var opsRecs = operation.getRecords();
            var pause = '';

            opsRecs.forEach(function(record, index, allItems) {
                if(record.isRoot()) {
                    var existingRoot = store.getRootNode();
                    existingRoot.set('_rev', record.data._rev);
                    existingRoot.endEdit(true);
                    existingRoot.commit(true);
                } else if(record.parentNode.dirty) {
                    // we do this here because the childIds field of the parentNode
                    // gets flagged as modified and marked as dirty when the tree runs 
                    // replaceChild to update the node with data from the server
                    record.parentNode.commit(true);  
                }
                
                // relay date updates from root node to the node we cloned from
                // in the container store to keep them in sync
                if(record.isRoot()) {
                    var containersStore = Ext.data.StoreManager.lookup('containersStore');
                    var relayNode = containersStore.getNodeById(record.getId());
                    if(relayNode) {
                        record.relayFields(relayNode);
                    }
                }
                
            });
        }        
    }    
         
});
