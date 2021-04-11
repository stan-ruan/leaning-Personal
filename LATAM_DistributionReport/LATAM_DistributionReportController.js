({
    init : function(component, event, helper) {
        component.set('v.reportData', []);
        component.set('v.currentPage', 1);
        component.set('v.buttonTitle', $A.get('$Label.c.LATAM_Distribution_Report_Hide_Customer_Level'));
        helper.getCallBack(component, event, helper);
    },
    searchByRoute: function(component, event, helper) {
        var isEnterKey = event.keyCode === 13;
        if (isEnterKey) {
            component.set('v.reportData', []);
            component.set('v.currentPage', 1);
            helper.getCallBack(component, event, helper);
        }
    },
    filterReport: function(component, event, helper) {
        component.set('v.reportData', []);
        component.set('v.currentPage', 1);
        helper.getCallBack(component, event, helper);
    },
    displayDetail: function(component, event, helper) {
        component.set('v.isShowDetail', !component.get('v.isShowDetail'));
        component.set('v.buttonTitle', $A.get('$Label.c.LATAM_Distribution_Report_Show_Customer_Level'));
        if(component.get('v.isShowDetail')){
            component.set('v.buttonTitle', $A.get('$Label.c.LATAM_Distribution_Report_Hide_Customer_Level'));
        }
    },
    goToDetail: function (component, event, helper) {
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": event.getSource().get("v.name"),
        });
        navEvt.fire();
    },
    goNextPage: function (component, event, helper) {
        var currentPage = component.get('v.currentPage');
        component.set('v.currentPage', currentPage + 1);
        helper.getCallBack(component, event, helper);
    }
})