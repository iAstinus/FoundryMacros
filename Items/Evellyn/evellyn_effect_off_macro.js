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
