({
    init : function(component, event, helper) {
    	auraLight.core.callRemote(
			this,
			component,
			'c.getAccessable',
			{},
			function(self, result, response){
    			if(result) {
    				component.set("v.matchProfile", true);
    			}
    			else {
    				component.set("v.matchProfile", false);
    			}
    		},
    		function(self, errors, response){
                auraLight.core.showToast(component, 'notifLib', 'error', 'Error', errors[0].message);
            },
            function(){

            }
		);
    },

    handleReCalculate : function(component, event, helper) {
    	auraLight.core.callRemote(
			this,
			component,
			'c.recalculate',
			{},
			function(self, result, response){
				auraLight.core.showToast(component, 'notifLib', 'success', 'Success', 'Re-Calculate job is running');
    		},
    		function(self, errors, response){
                auraLight.core.showToast(component, 'notifLib', 'error', 'Error', errors[0].message);
            },
            function(){

            }
		);
    }
})