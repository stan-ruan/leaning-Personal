({
    questionsForPoint: [],
    toastMessage: function(msg, type, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "type": type,
            "title": "",
            "message": msg
        });
        toastEvent.fire();
        $A.get("e.force:closeQuickAction").fire();
    },
})