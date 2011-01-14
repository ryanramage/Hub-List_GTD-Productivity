/* @class containers
 * @extends Ext.Controller
 * 
 */
Ext.regController("tasks", {
	defaultTarget: 'viewport',

	list: function() {
		Ext.Msg.alert('Alert', 'I aspire to display a list of tasks here.', Ext.emptyFn);
	}
});