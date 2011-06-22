Ext.define('HL.model.Container', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    
    requires: ['HL.proxy.Container'],
    
    fields: [
        {name: 'name', type: 'string'},
        {name: 'type', type: 'string', defaultValue: 'list'},
        {name: '_rev', type: 'auto', defaultValue: null},        
        {name: 'parentId',  type: 'string', defaultValue: 'rootcontainer'},
        {name: 'childIds', type: 'auto', defaultValue:[]},       
        {name: 'checked',   type: 'auto', defaultValue: null},
        {name: 'index', type: 'int', defaultValue: null, persist: false}, // caused problems when not explicity set to false
        {name: 'depth', type: 'int', defaultValue: 0, persist: false}, // caused problems when not explicity set to false                    
        {name: 'ancestors', type: 'auto', defaultValue: ['rootcontainer'], convert: function(value, record) {
            if(record.data.ancestors && (JSON.stringify(record.data.ancestors) === JSON.stringify(value)) ) {
                return record.data.ancestors;
            } else {
                return value;
            }
        }},            
        {name: 'leaf', type: 'bool', defaultValue: false, persist: false, convert: function(value, record) {
            // this is needed because right now when Ext.NodeInterface.decorate runs
            // it doesn't check to see if a node has children before giving it a value of false
            if(record.data.type === 'list') {
                return true;
            } else {
                return false;
            }
        }},
        {name: 'expandable', type: 'bool', defaultValue: false, persist: false, convert: function(value, record) {
            if( (record.data.childIds && record.data.childIds.length > 0) && record.data.type === 'folder' ) {
                return true;
            } else {
                return false;
            }        
        }},       
        {name: '_id', type: 'string', 
            convert: function(value, record) {
                // make sure we don't create a uuid for existing containers
                // loaded from couchdb
                if(value !== '') {
                    return value;
                }                 
                // make sure we don't create a uuid for the auto generated
                // default root container node or existing containers loaded from server
                // rootcontainer value is used in the ajax proxy url when loading initial data
                if(record.data.id === 'rootcontainer') {
                    return record.data.id;
                }
                // UUID generator found on stackoverflow 
                // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
                
                return uuid;
            }
        }
    ],
    
    constructor: function() {
        this.addEvents('beforeappend', 'beforeexpand', 'beforeinsert', 'beforeremove', 'append', 'insert', 'remove');
        return this.callParent(arguments);
    },
        
    addChildId: function(childNode, childIndex) {
        childIndex = childIndex || this.indexOf(childNode);
        var existingChildIndex = this.data.childIds.indexOf(childNode.getId());
        if(existingChildIndex !== childIndex) {
            var kids = this.data.childIds.slice(0);
            kids.splice(childIndex, 0, childNode.getId())
            this.set('childIds', kids);   // set tracks modifications
        }    
    },
    
    // stub method to find a better way to clone
    // a model while still maintaining persistent model
    // field values between the original and the clone   
    copy: function(newId, deep, relay) {
        var me = this;
        
        var clone = me.callParent(arguments);
        // match model's data with new clone so changes
        // to one are automatically made to the other
        if(relay) {
         
        }
        
        return clone;
    },
    // synchronizes task tree root which it's counter part
    // container model in the container tree
    relayFields: function(relayNode) {
        var me = this;
        var relayFields = me.fields.filter('persist', true);
        
        relayFields.each(function(field, fieldIndex, fieldCount) {
            relayNode[relayNode.persistenceProperty][field.name] = me[me.persistenceProperty][field.name];
        });
    },
    
    removeChildId: function(removedNode) {
        var childIndex = this.data.childIds.indexOf(removedNode.getId());
        if(childIndex !== -1) {
            var kids = this.data.childIds.slice(0);
            kids.splice(childIndex, 1);
            this.set('childIds', kids);
        }
    },
    
    removeAncestors: function() {
        this.get('ancestors').length = 0;
        // this makes the field modified
        this.set('ancestors', []);
    },

    updateAncestors: function() {
        var ancestors = [this.getId()];
        var parent = this;
        while (parent.parentNode) {
            parent = parent.parentNode;
            ancestors.push(parent.getId());
        }
        
        this.set('ancestors', ancestors); 
    },
            
    listeners: {
        append: function(node, appendedNode, childIndex) {
            node.addChildId(appendedNode, childIndex);
            appendedNode.updateAncestors();
        },
        insert: function(node, childNode, refNode) {
            node.addChildId(childNode);
            childNode.updateAncestors();
        },
        remove: function(node, removedNode) {
            node.removeChildId(removedNode);
        }                
    },
    proxy: 'container'       


});