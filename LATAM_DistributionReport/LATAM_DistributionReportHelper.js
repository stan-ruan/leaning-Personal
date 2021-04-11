({
    getCallBack : function(component, event, helper) {
        component.set('v.isShowSpinner',true);
        var action = component.get("c.getAllViewData");
        var actionParams = {
            intCurrentPages: component.get('v.currentPage'),
            strRouteQueryName: component.get('v.searchKey'),
            strBusinessUnit: component.get('v.selectedBU'),
            strVisitDate: component.get('v.dateValue')
        }
        action.setParams(actionParams);
        action.setCallback(this, function(response){
            component.set('v.isShowSpinner',false);
            if (response.getState() === "SUCCESS") {
                var reportData = component.get('v.reportData');
                var callback = response.getReturnValue() || {};
                component.set('v.reportData',reportData.concat(callback.lstRoute));
                component.set('v.isLastPage',callback.boolIsLastPage);
                component.set('v.isDivisional',callback.boolIsDivisional);
                component.set('v.options',callback.lstBusinessUnitFilter);
                if (component.get('v.isInit')) {
                    component.set('v.dateValue',callback.strVisitDateYesterday);
                    component.set('v.dateRange',[callback.strPreviousBlockFirstDay,callback.strVisitDateCurrentDay]);
                    component.set('v.isInit',false);
                }
            }else{
                console.log(response.getError());
            }
        })
        $A.enqueueAction(action);
    }
})