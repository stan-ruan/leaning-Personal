/**
 * @author Chenyang Li
 * @date 2019-10-29
 * @description This is the controller js for Lightning Component "LATAM_CreateRackRequestsCmp".
 */
({
    doInit: function(component, event, helper) {
        helper.doInit(component, event, helper);
    },
    handleRackClick: function(component, event, helper) {
        helper.popupModal(component, event, helper);
    },
    handleRackQuantityChange: function(component, event, helper) {
        helper.updateRackQuantity(component, event, helper);
    },
    handleRackQuantitySave: function(component, event, helper) {
        helper.saveRackQuantity(component, event, helper);
    },
    handleConfirmRackRequest: function(component, event, helper) {
        helper.makeRackRequests(component, event, helper);
    }
});
