({
    init : function(component, event, helper) {

    	/**
    	 * sample data
    	 */
    	// var queryInfo = {};
    	// queryInfo["objectName"] = "Test__c";
    	// queryInfo["fields"] = [];
    	// queryInfo["fields"].push("Name");
        // queryInfo["criterias"] = "Name";
        // queryInfo["extracriteria"] = "";
    	// queryInfo["criteria"] = [{},{}];
    	// queryInfo["showSize"] = 5;
        
        var eventName = component.get("v.eventName");
        var strTab = component.get("v.strTab");
        var listSelector = "#" + eventName + strTab + "aulist";

        $(listSelector).mouseleave(function(){
            $(listSelector).hide();
        }); 
    },

    autoComplete : function(component, event, helper) {
        var eventName = component.get("v.eventName");
        var strTab = component.get("v.strTab");
        var autoSeletor = "#" + eventName + strTab + "autoCompletevalue";
        var value = $(autoSeletor).val();

        if(value) {
            var queryInfo = component.get("v.queryInfo");

            queryInfo["criteria"].push({
                "name" : queryInfo["criterias"],
                "compare" : "like",
                "value" : value}
            );
            component.set("v.queryInfo", queryInfo);
            helper.getRecords(component, event, helper, "queryResults");
        }
        else {
            if(event.type.toLowerCase() === "mousedown") {
                return;
            }
            var source = component.get("v.eventName");
            var evt = component.getEvent("autoCompleteselect");
            source = source + "clear"
            evt.setParams({
                "source": source
            });
            evt.fire();
        }
    },

    showResults : function(component, event, helper) {
    	var queryResults = component.get("v.queryResults");

    	helper.autoComplete(component, helper ,queryResults);
    },

    handleControlChange : function(component, event, helper) {
        var controlParams = component.get("v.controlParams");
        if(controlParams["clear"]) {
            var eventName = component.get("v.eventName");
            var strTab = component.get("v.strTab");
            var autoSelector = "#" + eventName + strTab + "autoCompletevalue";
            $(autoSelector).val("");
        }
    }
})