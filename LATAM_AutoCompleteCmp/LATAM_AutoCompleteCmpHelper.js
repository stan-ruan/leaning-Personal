({
    autoComplete : function(component, helper, queryResults) {
    	$(".aulistli").remove();
        var resultList = [];
        queryResults.forEach(function(item){
            var itemObj = {};
            itemObj["value"] = item.id;
            for(var key in item.valueMap) {
                if(key === "Name") {
                    itemObj["label"] = item.valueMap["Name"];
                }
                else {
                    itemObj[key] = item.valueMap[key];
                }
            }

            if(resultList.length == 0) {
                resultList.push(itemObj);
            }
            else {
                var isContain = false;
                resultList.forEach(function(item){
                    if(item["value"] == itemObj["value"]) {
                        isContain = true;
                    }
                });
                if(!isContain) {
                    resultList.push(itemObj);
                }
            }
        });
        if(resultList.length > 0) {
            this.buildList(component, resultList);
            this.bindEventForSelectli(component, resultList, helper);
        }
    },

    buildList : function(component, resultArray) {
        var eventName = component.get("v.eventName");
        var length = resultArray.length;
        for(var i=0; i<length; i++) {
            var label = resultArray[i]["label"];
            var value = resultArray[i]["value"];
            var liDom = "<li class='aulistli' value='" + value + "'>"
                        + "<div class='aulistdiv'>" + label + "</div>"
                        + "</li>";

            var selector = "#" + eventName + "aulist";
            $(selector).append(liDom);
        }
        $(selector).show();
    },

    bindEventForSelectli : function(component, resultList, helper) {
        var eventName = component.get("v.eventName");
        var listSelector = "#" + eventName + "aulist";
        var autoSelector = "#" + eventName + "autoCompletevalue";
        $.each($(".aulistli"), function(index, ele){
            var $ele = $(ele);
            $ele.on('click keypress', function(e) {
                if(e.type == 'click' || (e.type == 'keypress' && e.keyCode == 13)) {
                    $(listSelector).hide();
                    var label = $ele.text();
                    var value = $ele.attr("value");
                    $(autoSelector).val(label);
                    var controlParams = component.get("v.controlParams");
                    controlParams["clear"] = false;
                    component.set("v.controlParams", controlParams);

                    var params = {};
                    resultList.forEach(function(item){
                        if(item["value"] === value) {
                            params = item;
                        }
                    });
                    helper.fireEvent(component, params)
                    $(".aulistli").remove();
                } 
            });
        });
    },

    fireEvent : function(component, params) {
        var evt = component.getEvent("autoCompleteselect");
        var source = component.get("v.eventName");
        evt.setParams({
            "source": source,
            "params": params
        });

        evt.fire();
    }
})