// itemmacro, requires warpgate
// will craeate copy of spell with 1 charge and modified DC\spell attack
// reverting clears stored spell
const maxSpellLevel = 3;
const itemDC = 15;
const itemAttack = 7;

let token = canvas.tokens.get(args[0].tokenId);
await warpgate.revert(token.document, `${args[0].item.uuid}.spell_gem_storage`);

let spells = args[0].actor.items.map(a => a).filter(i => i.type === 'spell');
let spellsAvailable = []

// filter available spells lower than max level, that can be stored by gem
for (var i = 0; i < spells.length; i++) {
    let spellLevel = spells[i].system.level;

    if (args[0].actor.system.spells['spell' + spellLevel].slotsAvailable
        && args[0].actor.system.spells['spell' + spellLevel].value > 0) {

        if (spellLevel <= maxSpellLevel) {

            spellsAvailable.push(spells[i])
        }
    }
};

console.log(spellsAvailable);

// dialog to choose spell to store
let dialogData = await warpgate.menu({
    inputs: [{
        // type: 'select spell to store', 
        label: `Spells`,
        type: "select",
        options: spellsAvailable.map(spell => spell.name)
    }],
    buttons: [{
        label: 'Yes',
        value: true,
    }]
    },
    {
      title: 'Choose spell to store',
      options: {
        width: '100%',
        height: '100%',    
      }
    }
);

if (dialogData["buttons"]) {
    let chosenSpell = spells.find(s => s.name === dialogData["inputs"][0]);
    const spellToStoreName = chosenSpell.name + " (stored)";

    // copying spell data
    let spellToStore = {
        embedded: {
            Item:  { 
                [spellToStoreName]: {
                    "type": chosenSpell.type,
                    "img": chosenSpell.img,
                    "system": chosenSpell.system,
                    "flags": chosenSpell.flags,
                    "effects": chosenSpell.effects.toObject()
                }
            }
        }
    };

    // modifying nessesary fields
    spellToStore['embedded']['Item'][spellToStoreName]['system']['preparation'] = {
        "mode": "atwill", "prepared": true
    };
    spellToStore['embedded']['Item'][spellToStoreName]['system']['uses'] = {
        "value": 1,
        "max": 1,
        "per": "charges"
    };
    if (chosenSpell.system.save.dc) {
        spellToStore['embedded']['Item'][spellToStoreName]['system']['save']['dc'] = itemDC;
        spellToStore['embedded']['Item'][spellToStoreName]['system']['save']['scaling'] = "flat";
    } else {
        spellToStore['embedded']['Item'][spellToStoreName]['system']['attackBonus'] = `${itemAttack} - (@mod + @prof)`;
    };

    // mutating token to add new stored spell
    await warpgate.mutate(token.document, spellToStore, {}, {name: `${args[0].item.uuid}.spell_gem_storage`});
    ui.notifications.info(`${spellToStoreName} has been added to your At-Will spells.`);

    // removing 1 spell slot (at spell needs to be casted, to store it in gem)
    if (chosenSpell.system.preparation.mode === 'pact') {
        var spellLevelLabel = 'pact';
    } else {
        var spellLevelLabel = `spell${chosenSpell.system.level}`;
    };
    
    const spellSlotsUpdate = {
        actor: {
            system: {
                spells: {
                    [spellLevelLabel]: {
                        value: args[0].actor.system.spells[spellLevelLabel].value - 1
                    }
                }
            }
        }
    };

    await warpgate.mutate(token.document, spellSlotsUpdate, {}, {permanent: true});
};
