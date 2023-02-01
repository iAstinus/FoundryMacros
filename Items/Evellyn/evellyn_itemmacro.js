// Evellyn itemmacro
// console.log("Item macro start");
// console.log(args[0]);

const ammoItem = args[0].actor.items.getName("Evellyn Bolt");

let ammoOptions = [];
for (var i = ammoItem.system.uses.value; i > 0; i--) {
    ammoOptions.push({"value": i, "html": i.toString()})
};

ammoOptions.push({"value": 0, "html": 0});

const dialogData = await warpgate.menu(
    {
        inputs: [{
            label: "How many arrows to shoot:",
            type: "select",
            options: ammoOptions,
        }],
        buttons: [{
            label: "Shoot",
            value: "make_shot"
        }, {
            label: "Reload",
            value: "make_reload"
        }]
    }, {
        title: "Choose an action",
        render: true,
        options: {
            width: "200px",
            height: "100%"
        }
    }
);

if (dialogData.buttons === 'make_reload') {

    let chatHeader = `
        <div class="dnd5e chat-card item-card midi-qol-item-card" 
            data-actor-id="${args[0].actor.id}" 
            data-item-id="${args[0].item._id}" 
            data-actor-uuid="${args[0].actor.uuid}" 
            data-item-uuid="${args[0].item.uuid}" 
            data-token-uuid="${args[0].tokenUuid}">

        <header class="card-header flexrow">
            <img src="${args[0].item.img}" title="Evellyn Reload" width="36" height="36" />
            <h3 class="item-name">Evellyn Reload</h3>
        </header>

        <div class="card-content">
        </div>`
    let chatContent = `<i>${args[0].actor.data.name}</i> reloads Evellyn crossbow`

    let chatData = {
        speaker: ChatMessage.getSpeaker(),
        content: chatHeader + chatContent
    };
    ChatMessage.create(chatData, {});
    
    const itemData = {
        embedded: {
            Item: {
                [`${ammoItem.name}`]: {
                    system: {
                        uses: {
                            value: ammoItem.system.uses.max
                        }
                    }
                }
            }
        }
    };
    
    await warpgate.mutate(canvas.scene.tokens.get(args[0].tokenId), itemData, {}, {permanent: true})

} else if (dialogData.buttons === 'make_shot') {
    if (dialogData.inputs[0]) {
        for (var i = dialogData.inputs[0]; i > 0; i--) {
            // await ammoItem.roll({"configureDialog": false});
            await MidiQOL.completeItemUse(ammoItem, {}, {"configureDialog": false})
        }
    }
};

// console.log("Item macro end");
