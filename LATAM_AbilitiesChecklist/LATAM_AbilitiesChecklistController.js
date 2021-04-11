({
    init: function(component, event, helper) {
        var detailStringList = $A.get('$Label.c.LATAM_Abilities_Checklist_Detail_Table').split(',');
        component.set('v.detailStringList',detailStringList);
        component.set('v.isShowSpinner',true);
        component.get('v.recordId')
        var action = component.get("c.getSurveyInformation");
        action.setParams({ strEvent : component.get('v.recordId') });
        action.setCallback(this, function(response){
            component.set('v.isShowSpinner',false);
            if (response.getState() === "SUCCESS") {
                if (response.getReturnValue().strRecordType == 'SOC' && !(response.getReturnValue().strWeekDay == '1' || response.getReturnValue().strWeekDay == '3')) {
                    $A.get("e.force:closeQuickAction").fire();
                    return;
                }
                if (response.getReturnValue().strRecordType == 'SOC' && !response.getReturnValue().boolIsFirstSubmit) {
                    helper.toastMessage($A.get('$Label.c.LATAM_SOC_Not_First_Submit_Message'), 'error');
                    $A.get("e.force:closeQuickAction").fire();
                    return;
                }
                if (response.getReturnValue().strRecordType != 'SOC' && !(response.getReturnValue().strWeekDay == '3' || response.getReturnValue().strWeekDay == '4')) {
                    $A.get("e.force:closeQuickAction").fire();
                    return;
                }
                if(response.getReturnValue()) {
                    var surveyInfo = {
                        salesRep: response.getReturnValue().strSalesRepName,
                        routeName: response.getReturnValue().strRouteName,
                        instructions: response.getReturnValue().strInstructions
                    }
                    var surveyTableHeader = {
                        skillTitle: response.getReturnValue().strSkillTitle,
                        leftWeekDay: response.getReturnValue().strLeftWeekDay,
                        rightWeekDay: response.getReturnValue().strRightWeekDay
                    }
                    if(response.getReturnValue().strRecordType == 'SOC'){
                        component.set('v.isFirstSubmit', response.getReturnValue().boolIsFirstSubmit);
                    }
                    component.set('v.surveyInfo', surveyInfo);
                    component.set('v.surveyTableHeader', surveyTableHeader);
                    component.set('v.currentDay', response.getReturnValue().strWeekDay);
                    component.set('v.questionsForNonPoint', response.getReturnValue().lstQuestionsForNonPoint);
                    component.set('v.questionsForPoint', response.getReturnValue().lstQuestionsForPoint);
                    component.set('v.eventRecordType', response.getReturnValue().strRecordType);
                    component.set('v.isDisabled', response.getReturnValue().strIsDisabled);
                    component.set('v.totalPointLstWed', response.getReturnValue().strTotalPointLstWed);
                    component.set('v.totalPointLstTh', response.getReturnValue().strTotalPointLstTh);
                    helper.questionsForPoint = response.getReturnValue().lstQuestionsForPoint;
                    console.log(response.getReturnValue());
                }else{
                    $A.get("e.force:closeQuickAction").fire();
                }
            }else{
                helper.toastMessage(response.getError()[0].message, 'error');
                $A.get("e.force:closeQuickAction").fire();
                console.log(response.getError());
            }
        })
        $A.enqueueAction(action);
    },
    changeAns: function(component, event, helper) {
        if (event.target.tagName == 'INPUT') {
            var index = event.currentTarget.dataset.inputIndex || -1;
            var prefix = event.currentTarget.dataset.prefix || '';
            var valueNum = document.querySelector('.'+prefix+index).checked ? 1 : 0;
            if (prefix == 'w-checkbox-toggle-') {
                helper.questionsForPoint[index].strFirstAnswers = valueNum;
            }
            if (prefix == 't-checkbox-toggle-') {
                helper.questionsForPoint[index].strSecAnswers = valueNum;
            }
        }
    },
    cancelSurvey: function(component, event, helper) {
        component.set('v.isShowConfirm', true);
        component.set('v.isCancel', true);
        component.set('v.confirmMessage',$A.get('$Label.c.LATAM_Survey_Cancel_Confirm_Msg'));
    },
    csubmitSurvey: function(component, event, helper) {
        component.set('v.isShowConfirm', true);
        component.set('v.isCancel', false);
        component.set('v.confirmMessage',$A.get('$Label.c.LATAM_Survey_Submit_Confirm_Msg'));
    },
    cancelConfirm: function(component, event, helper) {
        component.set('v.isShowConfirm', false);
    },
    closeQuickAction: function(component, event, helper) {
        component.set('v.isShowConfirm', false);
        $A.get("e.force:closeQuickAction").fire();
        if(!component.get('v.isCancel')){
            var submitValue = {
                strSalesRepName: component.get('v.surveyInfo.salesRep'),
                strRouteName: component.get('v.surveyInfo.routeName'),
                strWeekDay: component.get('v.currentDay'),
                lstQuestionsForNonPoint: component.get('v.questionsForNonPoint'),
                lstQuestionsForPoint: helper.questionsForPoint,
                strTotalPointLstTh: component.get('v.totalPointLstTh'),
                strTotalPointLstWed: component.get('v.totalPointLstWed')
            };
            console.log(submitValue)
            var action = component.get("c.submitSurvey");
            action.setParams({ surveyInformation : submitValue, strEventId: component.get('v.recordId') });
            action.setCallback(this, function(response){
                console.log(response)
                if (response.getState() === "SUCCESS") {
                    console.log(response)
                }else{
                    helper.toastMessage('ERROR', 'error');
                    console.log(response.getError());
                }
            })
            $A.enqueueAction(action);
        }
    },
    showDetail: function(component, event, helper) {
        component.set('v.isShowDetail', true);
    },
    closeDetail: function(component, event, helper) {
        component.set('v.isShowDetail', false);
    }
})