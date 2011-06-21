Ext.define('HL.view.container.dd.ViewDragZone', {
    extend: 'Ext.tree.ViewDragZone',
    
    beforeDragDrop: function(target, e, id){
        return true;
    }, 

    beforeDragEnter: function(target, e, id) {
        return true;
    },
    
    beforeDragOver: function(target, e, id) {
        var overRecord = null;
        var node = e.getTarget(target.view.getItemSelector());
        
        if(node) {
            overRecord = target.view.getRecord(node);
        }
        
        // enforce not being able to drop things onto lists
        if(overRecord && overRecord.data.type === 'list') {
            return false;
        } else {
            return true;
        }
    }
    
       
});