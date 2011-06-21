Ext.define('HL.proxy.Container', {
    extend: 'Ext.data.proxy.Rest',
    alias: 'proxy.container',
    
    actionMethods: {
        create : 'PUT',
        read   : 'GET',
        update : 'PUT',
        destroy: 'DELETE'
    },
           
    startParam: 'startkey',
    noCache: false,
    batchActions: false, // TODO: make this friendly with couchdb _bulk_docs feature
    url: '/',
            
    beforerequest: function(connection, options) {
        var pause = '';
    },
    
    constructor: function(config) {
        var me = this;
        
        config = config || {};
        me.callParent([config]);
    },
    
    create: function(operation, proxy, store) {
        var record = operation.records[0];
        if(record.data._rev === null) {
            var _revField = record.fields.getByKey('_rev');
            _revField.persist = false; // sneaky way to make sure this isn't sent in ajax request
        }
        
        this.api.create = '/' + HL.app.db + '/';
        
        return this.doRequest.apply(this, arguments);
    },
    
    read: function(operation, proxy, store) {
        // work-around for api object getting clobbered when extending a proxy
        this.api.read = '/' + HL.app.db + '/_design/app/_view/containers';
        // encode the key value correctly to play nice with couchdb
        if(operation.params.key) {
            operation.params.key = Ext.JSON.encode(operation.params.key);
        }
        return this.doRequest.apply(this, arguments);
    },
    
    update: function(operation, proxy, store) {
        var record = operation.records[0];
        this.api.update = '/' + HL.app.db + '/';
        // needed here because when items are added to the tree as childNodes
        // of existing nodes, the store can't tell if they are new or not
        // so it treats them as updated records even though they have no _rev value
        if(record.data._rev === null) {
            var _revField = record.fields.getByKey('_rev');
            _revField.persist = false; // sneaky way to make sure this isn't sent in ajax request
        }
        return this.doRequest.apply(this, arguments);
    },
    
    destroy: function(operation, proxy, store) {
        this.api.destroy = '/' + HL.app.db + '/';
        return this.doRequest.apply(this, arguments);
    }, 
                      
    reader: {
        type: 'json',
        root: 'children',
        record: 'value',
        successProperty: 'ok'
        //totalProperty: 'total_rows', // can't use this without factoring in offset from couch            
    },
    
    buildHierarchyFromJson: function(nodeIds, hierarchy, allNodes) {
        var me = this;
        var recordKey = me.reader.record;
        var childKey = me.reader.root;
        
        nodeIds.forEach(function(item, index, allItems) {
            var node = me.itemByObjKeyVal(allNodes, 'id', item);                
            var childIds = node[recordKey]['childIds'];
            // not a fan of if checking for type here, todo: find a better way
            if(node[recordKey]['type'] !== 'list' && childIds && childIds.length > 0) {
                // place children object where the reader is expecting to 
                // find them
                var childNodes = node[recordKey][childKey] = [];
                me.buildHierarchyFromJson(childIds, childNodes, allNodes);
            }
            
            hierarchy.push(node);
        }, me);
    },
    
    // add child nodes back as children records formatted the way
    // the reader is expecting, using data from childNodes
    buildHierarchyFromRecords: function(formattedRecord, existingRecord) {
        var me = this;
        
        existingRecord.childNodes.forEach(function(child, childIndex, allChildren) {
            var kid = {value:{}};
            // only use persistedFields to mimic a server response
            var persistedFields = child.fields.filter('persist', true);
            persistedFields.each(function(field, fieldIndex, fieldCount) {
                kid.value[field.name] = child.get(field.name);
            });
            
            if(child.data.type !== 'list' && child.childNodes.length > 0) {
                kid.value.children = [];
                me.buildHierarchyFromRecords(kid, child);
            }
            formattedRecord.value.children.push(kid);
        }); 
    },
    
    itemByObjKeyVal: function(haystack, key, val) {
        var items = haystack.filter(function(item, index, allItems) {
            if(item[key] === val) {
                return true;
            } else {
                return false;
            }
        });
        
        return items[0];
    },
    
    extractResponseData: function(response) {            
        var rawData = this.reader.getResponseData(response);

        if(response.request.options.action === 'read') {            
            var me = this;
            var rootKey = 'rootcontainer';
            var recordKey = me.reader.record;
                        
            // create a new array to hold formatted data
            var formattedData = {};
            formattedData.children = [];
            
            // check for no data condition when requesting rootcontainer, assume its a fresh install
            if(response.statusText === 'OK' && rawData.total_rows === 0 && response.request.options.params.key === '"rootcontainer"') {
                HL.app.populateWelcomeData();
                return rawData;
            }
            
            // find rootcontainer within response 
            var rootContainer = this.itemByObjKeyVal(rawData.rows, 'id', rootKey);

            var containerStore = Ext.data.StoreManager.lookup('containersStore');
            var defaultRootNode = containerStore.getRootNode();
            // sneaky way to gently update the default root node with real
            // data from the root container on the server
            Ext.Object.merge(defaultRootNode.data, rootContainer.value);      
            
            // organize items into a proper hierarchy starting from root container
            this.buildHierarchyFromJson(rootContainer[recordKey]['childIds'], formattedData.children, rawData.rows);
            
            return formattedData;
        } else if(response.request.options.action === 'update' || response.request.options.action === 'create') {
            // create a new array to hold formatted data
            var formattedData = {};
            formattedData.children = [];                
            
            // this block makes sure the model is updated with the new _rev hash
            // returned from the server. the data classes expect the server result to have
            // a full model record and because couchdb doesn't return all the fields
            // I use this block to mix the existing data with the new _rev id.
            var existingRecord = response.request.options.operation.records[0];
            if(existingRecord.data._id === rawData.id) {            
                // only use persisted fields to mimic a server response
                var modelFields = existingRecord.fields.filter('persist', true);
                var formattedRecord = {value:{}};

                modelFields.each(function(field, fieldIndex, fieldCount) {
                    formattedRecord.value[field.name] = existingRecord.get(field.name);
                });
                formattedRecord.value._rev = rawData.rev; // overwrite _rev with value from the server
                // make sure the _rev field is correctly set to persist
                // manually setting it to false on create/update caused problems
                // if we didn't set it back to true here
                existingRecord.fields.getByKey('_rev').persist = true;  
                
                formattedRecord.value.children = [];
                if(existingRecord.childNodes && existingRecord.childNodes.length > 0) {
                    this.buildHierarchyFromRecords(formattedRecord, existingRecord);
                }
                
                formattedData.children.push(formattedRecord);                   
            }
            
            return formattedData;
        } else {
            return rawData;
        }
    }
        
});