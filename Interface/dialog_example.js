
const results = await warpgate.menu({
    inputs: [{
        label: "Header is here",
        type: "header",
    }, {
        label: "regular text is here",
        type: "info"
    }, {
        label: "<hr>",
        type: "info"
    }, {
        label: "selector: radio 1",
        type: "radio",
        options: "radio_groud",
        value: "radio1_clicked"
    }, {
        label: "selector: radio 2",
        type: "radio",
        options: "radio_groud",
        value: "radio2_clicked"
    },{
        label: "<hr>",
        type: "info"
    }, {
        label: "selector: select",
        type: "select",
        options: [
            {"value":1, "html": "1"}, 
            {"value":2, "html": "2"},
            {"value":5, "html": "5"},
        ],
    }],
    buttons: [{
        label: "Yes",
        value: 1,
        callback: () => ui.notifications.info('Yes was clicked'),
    },{
        label: "No",
        value: 2,
        callback: () => ui.notifications.info('No was clicked'),
    },]
}, {
    title: "Window title",
    render: true,
    options: {
        width: '300',
        height: '100%', 
    }
})

console.log(results);