// itemmacro, requires warpgate
// will craeate copy of spell with 1 charge and modified DC\spell attack
// reverting clears stored spell
const maxSpellLevel = 3;
const itemDC = 15;
const itemAttack = 7;

let token = canvas.tokens.get(args[0].tokenId);
await warpgate.revert(token.document, `${args[0].item.uuid}.spell_gem_storage`);

let spells = args[0].actor.items.map(a => a).filter(i => i.type === 'spell');
let spellSlotsAvailable = Object.entries(args[0].actor.system.spells);
console.log(spellSlotsAvailable);
let spellsAvailable = []

// filter available spells lower than max level, that can be stored by gem
for (var i = 0; i < spells.length; i++) {
    let spellLevel = spells[i].system.level;

    if (spellLevel <= maxSpellLevel) {
        if (spellLevel === 0) {
            spellsAvailable.push(spells[i])
        } else {
            if (spellSlotsAvailable.filter(i => (i[0].charAt(5) >= spellLevel) && (i[1].value > 0)).length > 0) {
                spellsAvailable.push(spells[i])
            } else if (spellSlotsAvailable.find(i => i[0] === 'pact')[1].level >= spellLevel) {
                spellsAvailable.push(spells[i]) // workaround for pact magic
            }
        }
    }
};

// dialog to choose spell to store
let dialogData = await warpgate.menu({
    inputs: [{
        // type: 'select spell to store', 
        label: `Spells`,
        type: "select",
        options: spellsAvailable.map(spell => spell.name)
    }],
    buttons: [{
        label: 'Selected',
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

    // now user has to cast chosen spell (i.e. we need to remove spell slot because of it)
    // spell can be casted using different spell slot, so we need and extra dialog
    let secondaryDialogInputs = [];
    let availableSlots = spellSlotsAvailable.filter(ss => (ss[0].charAt(5) >= chosenSpell.system.level) && (ss[1].value > 0));

    if (spellSlotsAvailable.find(ss => ss[0] === 'pact').length > 0) {
        const pactSlots = spellSlotsAvailable.find(ss => ss[0] === 'pact');
        if ((pactSlots[1].value > 0) && (pactSlots[1].level >= chosenSpell.system.level)) {
            availableSlots.push(pactSlots)
        }
    };
    console.log(availableSlots);

    for (let i = 0; i< availableSlots.length; i++) {
        let inputLabel = "";

        if (availableSlots[i][0] === 'pact') {
            inputLabel = 'Pact Magic'
        } else if (availableSlots[i][0].charAt(5) == 1) {
            inputLabel = '1st Level'
        } else if (availableSlots[i][0].charAt(5) == 2) {
            inputLabel = '2nd Level'
        } else if (availableSlots[i][0].charAt(5) == 3) {
            inputLabel = '3rd Level'
        } else if (availableSlots[i][0].charAt(5) > 3) {
            inputLabel = `${availableSlots[i][0].charAt(5)}th Level`
        } 

        secondaryDialogInputs.push({
            label: inputLabel,
            type: "radio",
            options: "spell_slot",
            value: availableSlots[i][0]
        })
    };

    let secondaryDialogData = await warpgate.menu({
        inputs: secondaryDialogInputs,
        buttons: [{
            label: 'Use spell slot',
            value: true,
        }]
    }, {
        title: "Choose spell slot to use",
        options: {
            width: '100%',
            height: '100%', 
        }
    });

    console.log(secondaryDialogData);

    if (secondaryDialogData['buttons']) {
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

        //play animation
        new Sequence()
            .effect()
                .file("jb2a.energy_strands.in.yellow.01.1")
                .atLocation(args[0].tokenId)
                .randomRotation()
                .scale(0.4)
                .fadeIn(500)
                .fadeOut(500)
                .wait(200)
            .effect()
                .file("jb2a.energy_strands.in.blue.01.1")
                .atLocation(args[0].tokenId)
                .scale(0.3)
                .scaleIn(0.15, 500)
                .fadeIn(500)
                .fadeOut(500)
                .rotateIn(45, 500, {ease: "easeOutCubic"})
                .waitUntilFinished(-500)
            .effect()
                .file("jb2a.energy_strands.overlay.blueorange.01")
                .atLocation(args[0].tokenId)
                .fadeIn(500)
                .fadeOut(500)
                .duration(3000)
                .scaleToObject(1.4)
        .play()

        // removing 1 spell slot (at spell needs to be casted, to store it in gem)
        spellLevelLabel = secondaryDialogData.inputs.find(i => i)

        if (chosenSpell.system.level > 0) {
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
        }
    }
    
};
