/**
 * @author Chenyang Li
 * @date 2019-10-29
 * @description This is the helper js for Lightning Component "LATAM_CreateRackRequestsCmp".
 */
({
    doInit: function(component, event, helper) {
        component.set("v.isShowSpinner", true);
        var recordId = component.get("v.recordId");
        var type = component.get("v.type");
        auraLight.core.callRemote(
            this,
            component,
            "c.getRackWrapperList",
            {
                idCustomer: recordId,
                strType: type
            },
            function(self, result, response) {
                if (result === null) {
                    helper.popupNoPermission(component, event, helper);
                    component.find("rackModal").notifyClose();
                    return;
                }
                if (result && result.length === 0) {
                    auraLight.core.showToast(
                        component,
                        "notifLib",
                        "warn",
                        $A.get("$Label.c.LATAM_Show_Toast_Title_Warn"),
                        $A.get("$Label.c.LATAM_Rack_No_Record_Found")
                    );
                    component.find("rackModal").notifyClose();
                    return;
                }
                component.set("v.racks", result);
            },
            function(self, errors, response) {
                auraLight.core.showToast(
                    component,
                    "notifLib",
                    "error",
                    $A.get("$Label.c.LATAM_Show_Toast_Title_Error"),
                    errors[0].message
                );
            },
            function() {
                component.set("v.isShowSpinner", false);
            }
        );
    },
    popupModal: function(component, event, helper) {
        var shortId = event.getSource().get("v.value");
        if (!shortId) return;

        var rack = helper.getRack(component, shortId);
        var modalBody;
        var modalFooter;
        $A.createComponents(
            [
                [
                    "c:LATAM_RackCardCmp",
                    {
                        full: true,
                        asset: rack
                    }
                ],
                ["c:LATAM_RackModalFooterCmp", { shortId }]
            ],
            function(content, status) {
                if (status === "SUCCESS") {
                    modalBody = content[0];
                    modalFooter = content[1];
                    component.find("rackModal").showCustomModal({
                        header: $A.get(
                            "$Label.c.LATAM_Rack_Quantity_Specification"
                        ),
                        body: modalBody,
                        footer: modalFooter,
                        showCloseButton: false,
                        closeCallback: function() {}
                    });
                } else {
                    auraLight.core.showToast(
                        component,
                        "notifLib",
                        "error",
                        $A.get("$Label.c.LATAM_Show_Toast_Title_Error"),
                        "FATAL ERROR: Fail to create a modal!"
                    );
                }
            }
        );
    },
    getRack: function(component, shortId) {
        return component
            .get("v.racks")
            .filter(rack => rack.strShortId === shortId)[0];
    },
    setRack: function(component, shortId, quantity) {
        var racks = component.get("v.racks");
        var quantityWithNoDecimal = Math.floor(quantity);

        if (Number(quantity) !== quantityWithNoDecimal) {
            auraLight.core.showToast(
                component,
                "notifLib",
                "warn",
                $A.get("$Label.c.LATAM_Show_Toast_Title_Warn"),
                $A.get("$Label.c.LATAM_Rack_Quantity_With_Decimal")
            );
            quantity = quantityWithNoDecimal;
        }
        racks.map((rack, index) => {
            if (rack.strShortId === shortId) {
                rack.intQuantity = quantity;
            }
        });
        component.set("v.racks", racks);
    },
    updateRackQuantity: function(component, event, helper) {
        var shortId = event.getParam("shortId");
        var quantity = Number(event.getParam("quantity"));
        component.set("v.selectedRack", { shortId, quantity });
    },
    saveRackQuantity: function(component, event, helper) {
        var shortId = event.getParam("shortId");
        if (shortId === undefined) {
            component.set("v.selectedRack", {});
            return;
        }
        var selectedRack = component.get("v.selectedRack");
        if (selectedRack && selectedRack.shortId === shortId) {
            helper.setRack(component, shortId, selectedRack.quantity);
        }
    },
    makeRackRequests: function(component, event, helper) {
        var filteredRacks = helper.filterRacks(component);
        if (filteredRacks.length === 0) {
            auraLight.core.showToast(
                component,
                "notifLib",
                "warn",
                $A.get("$Label.c.LATAM_Show_Toast_Title_Warn"),
                $A
                    .get("$Label.c.LATAM_Rack_Some_Requests_Sent")
                    .replace("{0}", "0")
            );
            component.find("rackModal").notifyClose();
            return;
        }

        auraLight.core.callRemote(
            this,
            component,
            "c.makeNewRackRequests",
            {
                idCustomer: component.get("v.recordId"),
                strSerializedRackWrapper: JSON.stringify(filteredRacks)
            },
            function(self, result, response) {
                if (result === null) {
                    helper.popupNoPermission(component, event, helper);
                    return;
                }

                $A.get("e.c:LATAM_ViewRackListRefreshEvt").fire();

                auraLight.core.showToast(
                    component,
                    "notifLib",
                    "success",
                    $A.get("$Label.c.LATAM_Show_Toast_Title_Success"),
                    $A
                        .get("$Label.c.LATAM_Rack_Some_Requests_Sent")
                        .replace("{0}", result)
                );
            },
            function(self, errors, response) {
                auraLight.core.showToast(
                    component,
                    "notifLib",
                    "error",
                    $A.get("$Label.c.LATAM_Show_Toast_Title_Error"),
                    errors[0].message
                );
            },
            function() {
                component.find("rackModal").notifyClose();
            }
        );
    },
    filterRacks: function(component) {
        return component.get("v.racks").filter(rack => rack.intQuantity > 0);
    },
    popupNoPermission: function(component, event, helper) {
        auraLight.core.showToast(
            component,
            "notifLib",
            "error",
            $A.get("$Label.c.LATAM_Show_Toast_Title_Error"),
            $A.get("$Label.c.LATAM_Rack_No_Permission")
        );
    }
});
