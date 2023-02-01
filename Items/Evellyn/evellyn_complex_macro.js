// actor, token and effect are passed by effect macro

// On effect toggle on
// console.log("EffecMacro: ON");
// console.log(actor, token, effect);

const sourceItem = actor.items.getName("Evellyn");

const itemData = {
    embedded: {
        Item: {
            "Evellyn Bolt": {
                type: "consumable",
                img: "icons/weapons/ammunition/arrowhead-glowing-blue.webp",
                system: {
                    description: {
                        value: "Ammunition for Evellyn crossbow, enchanted with cold.",
                        },
                    source: "Evellyn",
                    activation: {
                        type: "action",
                        cost: 1,
                        condition: ""
                        },
                    target: {
                        value: 1,
                        width: null,
                        units: "",
                        type: "creature"
                        },
                    range: {
                        // copying from source item, not nessesary
                        value: sourceItem.system.range.value,
                 units: sourceItem.system.range.units
                        },
                               long: sourceItem.system.range.long,
                    uses: {
                        value: 3,
                        max: "3",
                        per: "charges"
                        },
                    consumableType: "ammo",
                    rarity: "uncommon",
                    weight: 0,
                    quantity: 1,
                    actionType: "rwak",
                    attackBonus: "1",
                    damage: {
                        parts: [
                        ["1d4 + 1 + @mod", "cold"]
                        ]}, 
                    },
                }
            },
        }
    };

await warpgate.mutate(token.document, itemData, {}, {permanent: true});
ui.notifications.info(`Evellyn Bolts has been added to your ammunition.`);

// -------------------------------------------------------------------------------

// On effect toggle off
// console.log("EffecMacro: OFF");
// console.log(actor, token, effect);

const sourceItem = actor.items.getName("Evellyn");

const itemData = {
    embedded: {
        Item: {
            "Evellyn Bolt": warpgate.CONST.DELETE
        }
    }
};

await warpgate.mutate(token.document, itemData, {}, {permanent: true})

ui.notifications.info(`Evellyn Bolts has been removed.`);

// -------------------------------------------------------------------------------

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
