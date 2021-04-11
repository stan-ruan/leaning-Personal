({
    init : function(component, event, helper) {
        var mainKpisList = [{
            title: 'Ventas',
            value: '$9,407',
            discription: '$593 debajo objectivo',
            color: 'red'
        },{
            title: 'Cumplimiento Visita',
            value: '618(98%)',
            discription: '7 de 625 visitas perdidas',
            color: 'yellow'
        },{
            title: 'Jornada Completa',
            value: '10h 48m',
            discription: '23m tiempo predido',
            color: 'blue'
        }]
        component.set('v.mainKpisList',mainKpisList);
    },
    navigateToInfo : function(component, event, helper) {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/lightning/n/Como_Estoy_info"
        });
        urlEvent.fire();
    },
    navigateToCalendar : function(component, event, helper) {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/lightning/o/Event/home"
        });
        urlEvent.fire();
    }
})
