HubList.Container = Ext.regModel('Container', {
    fields: [
        {name: 'id', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'type', type: 'string'},
        {name: 'containerId', type: 'int'}
    ],
      
    associations: [
    	{type: 'hasMany', model: 'Container', name: 'children'},
    	{type: 'belongsTo', model: 'Container', foreignKey: 'containerId'}
    ],
    
    proxy: {
        type: 'localstorage',
        id  : 'containers'
    }

});