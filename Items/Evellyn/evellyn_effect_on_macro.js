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
