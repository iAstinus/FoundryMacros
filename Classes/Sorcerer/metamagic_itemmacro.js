// Heavilly rewritten Kekilla's Font of Magic macro
// regular ItemMacro
// requres warpgate, as it uses its warpgate.menu()
// to fix width of the table in window I changed warpgate module.js 
    // else if (type.toLowerCase() == `radio`)
    // to
    // `<tr><th style="width:90%;text-align:left"><label>${label}</label></th><td style="width:10%">
// macro checks Sorcery Points in resourse tab, then Sorcery Points in features
// it also checks features for different metamagic options, look at the sorceryItems table below

// console.log('------------Sorcery Points macro start-------------');

// geting args
const lastArg = args[args.length - 1];
// console.log(lastArg);

// actor data
data = {
    items: [], 
    spellSlots: {},
    spellSlotsAvailable: {},
    spellSlotsMissing: {}, 
    sorcPoints: {}, 
    cost : {"spell1": 2, "spell2": 3, "spell3": 5, "spell4": 6, "spell5": 7}, 
    spellDiff : [], 
    sorcDiff : false,
    canOverflow: true
};


// getting data
function getActorData(actor) {
    // getting available options
    let sorceryItems = [
        ["Sorcerer", null], 
        ["Sorcery Points", null],
        ["Font of Magic", null], 
        ["Metamagic - Careful Spell", 1], 
        ["Metamagic - Distant Spell", 1], 
        ["Metamagic - Empowered Spell", 1], 
        ["Metamagic - Extended Spell", 1], 
        ["Metamagic - Heightened Spell", 3], 
        ["Metamagic - Quickened Spell", 2], 
        ["Metamagic - Subtle Spell", 1], 
        ["Metamagic - Twinned Spell", "varies"],
        ["Metamagic - Seeking Spell", 2],
        ["Metamagic - Transmuted Spell", 1],
        ["Magical Guidance", 1],
        ["Bastion of Law", "varies"],
    ];
    sorceryItems.forEach(i => {
        let item = actor.items.getName(i[0]);
        if (!item) data.items.push({_id: null, name: i[0], cost: i[1]});
        else data.items.push({_id: item.id, name: i[0], cost: i[1]})
    });

    // getting current and maximum spell slots
    data.spellSlots = actor.system.spells;

    // geeting sorcery points 
    // need two checks - is it in resources and if not - is it in items

    // check for resources
    const resources = actor.system.resources;
    let resourceCheck = Object.entries(resources).filter(
        ([key, value]) => value.label === 'Sorcery Points');
    if (resourceCheck.length > 0) {
        data.sorcPoints[resourceCheck[0][0]] = resources[resourceCheck[0][0]]
    } else {
        // now check for Sorcery Points item (for monster, for example)
        let sorcPointsItemId = data.items.find(i => i.name === 'Sorcery Points')._id;
        if (sorcPointsItemId) {
            // console.log('Sorcery Points found in items');
            data.sorcPoints[sorcPointsItemId] = actor.items.find(i => i.id === sorcPointsItemId).system.uses;
        }
    }
}

// support functions
function checkAction(name)
{
    return data.items.find(i => i.name === name)._id !== null;
}

function editSorcPoints(num)
{
    let sorcPointsName = Object.keys(data.sorcPoints)[0];

    if (data.canOverflow) {
        data.sorcPoints[sorcPointsName].value = Math.clamped(
            data.sorcPoints[sorcPointsName].value + num, 0, 100); //100 sounds high enough
    } else {
        data.sorcPoints[sorcPointsName].value = Math.clamped(
            data.sorcPoints[sorcPointsName].value + num, 0, data.sorcPoints[sorcPointsName].max);
    }
    
    data.sorcDiff = true;
}

function editSpellSlots(level, num)
{
    let check = data.spellSlots[level];

    data.spellSlots[level].value = Math.clamped(check.value + num, 0, check.max);
    data.spellDiff.push(level);
}

function checkSlotsAvailable()
{
  for (key in data.spellSlots) {
    if (key === 'pact' && data.spellSlots[key].max == 0) {
        // pass
    } else if (data.spellSlots[key].max > 0) {
        data.spellSlotsAvailable[key] = [data.spellSlots[key].value, data.spellSlots[key].max];
    }
  }
}

function checkSlotsMissing()
{
  for (key in data.spellSlotsAvailable) {
        data.spellSlotsMissing[key] = data.spellSlotsAvailable[key][1] - data.spellSlotsAvailable[key][0];
  }
}

async function rollItem(name)
{
    lastArg.actor.items.getName(name).roll({"configureDialog": false})
}

async function updateActor(actor)
{
    if (data.sorcDiff) {
        let sorcPointsName = Object.keys(data.sorcPoints)[0];

        if (['primary', 'secondary', 'tertiary'].includes(sorcPointsName)) {
            actor.update({"system.resources": data.sorcPoints});
        } else {
            actor.items.get(sorcPointsName).update({"system.uses": data.sorcPoints[sorcPointsName]});
        }
    }

    if (data.spellDiff.length > 0) {
        data.spellDiff.forEach(spell => {
            actor.update({"system.spells": data.spellSlots})
        })
    }
}

function getSorcPoints() {
    const params = data.sorcPoints[Object.keys(data.sorcPoints)[0]];
    return { value: params.value, max: params.max }
}

function parseSpellName(spellName) {
    if (spellName === 'pact') {
        return "Pact"
    } else if (parseInt(spellName.charAt(5)) === 1) {
        return "1st level"
    } else if (parseInt(spellName.charAt(5)) === 2) {
        return "2nd level"
    } else if (parseInt(spellName.charAt(5)) === 3) {
        return "3rd level"
    } else {
        return `${parseInt(spellName.charAt(5))}th level`
    }
}

function getSpellDots(spellName) {
    let spellDots = ""
    for (var i = 0; i < data.spellSlotsAvailable[spellName][0]; i++) {
        spellDots = spellDots + '&#9679'
    }
    for (var i = data.spellSlotsAvailable[spellName][0]; i < data.spellSlotsAvailable[spellName][1]; i++) {
        spellDots = spellDots + '&#9675'
    }
    return spellDots
}

async function createChatMessage(eventType, spell) {
    let chatHeader = `
        <div class="dnd5e chat-card item-card midi-qol-item-card" 
            data-actor-id="${lastArg.actor.id}" 
            data-item-id="${lastArg.item._id}" 
            data-actor-uuid="${lastArg.actor.uuid}" 
            data-item-uuid="${lastArg.item.uuid}" 
            data-token-uuid="${lastArg.tokenUuid}">

        <header class="card-header flexrow">
            <img src="${lastArg.item.img}" title="Font of Magic" width="36" height="36" />
            <h3 class="item-name">Font of Magic</h3>
        </header>

        <div class="card-content">
        </div>`
    let chatContent = ``

    if (eventType === "Create Spell Slots") {
        chatContent = chatContent + `<i>${lastArg.actor.data.name}</i> is converting <b>${data.cost[spell]}</b> Sorcery Points into <b>${parseSpellName(spell)}</b> Spell Slot`;
    } else if (eventType === "Convert Spell Slots") {
        chatContent = chatContent + `<i>${lastArg.actor.data.name}</i> is converting <b>${parseSpellName(spell)}</b> Spell Slot into <b>${parseInt(spell.charAt(5))}</b> Sorcery Points`;
    }

    let chatData = {
        speaker: ChatMessage.getSpeaker(),
        content: chatHeader + chatContent
    };
    ChatMessage.create(chatData, {});
}

async function playAnimation(tokenId, option) {
    // console.log("--animation starts--");

    token = canvas.tokens.get(tokenId)

    if (option === 'default') {
        // console.log("-default animation-");
        
        new Sequence()
            .effect()
                .file("jb2a.moonbeam.01.intro.rainbow")
                .atLocation(token)
                .fadeIn(100)
                .fadeOut(200)
                .duration(1200)
                .waitUntilFinished(-500)
            .effect()
                .file("jb2a.toll_the_dead.green.shockwave")
                .atLocation(token)
                .fadeIn(500)
                .fadeOut(500)
                .scale(0.5)
                .scaleIn(0, 500, {ease: "easeOutCubic", delay: 100})
        .play();
    }
}

async function runDialog(actor) {

    let _sorcPoints = getSorcPoints();    

    let sorcOptions = [];
    if (data.items.map(i => i.name).includes("Font of Magic")) {
        sorcOptions.push(["Convert Spell Slots", null], ["Create Spell Slots", null])
    };

    let sorcInputs = [
    {
        label: `<tr><th style="width:50%;text-align:left"><label>Sorcery Points:</label></th> <td>${_sorcPoints.value}/${_sorcPoints.max}</td></tr>`,
        type: "info"
    },
    {
        label: `<hr></hr>`,
        type: "info"
    },
    ];

    let spellLabel = {
        label: `<b>Spells:<b>`,
        type: "info"
    };
    for (key in data.spellSlotsAvailable) {
        spellLabel.label = spellLabel.label + `<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${parseSpellName(key)}: <span style="font-size:20px">${getSpellDots(key)}</span></p>`
    };

    sorcInputs.push(spellLabel, {
        label: `<hr>`,
        type: "info"
    }, {
        label: `<p style="text-align:center"><b>Choose an option:</b></p>`,
        type: "info"
    }
    );

    data.items.filter(i => i._id !== null && !["Sorcerer", "Font of Magic", "Sorcery Points"].includes(i.name)).forEach(i => {
        sorcOptions.push([i.name, i.cost])
    })

    sorcOptions.forEach(i => {
        let __label = `${i[0].replace('Metamagic - ', '')}`;
        let _available = false;

        if (i[0] === "Convert Spell Slots") {
            _available = true;
        } else if (i[0] === "Create Spell Slots") {
            _available = data.sorcPoints[Object.keys(data.sorcPoints)[0]].value > 0;
        } else if (i[1] && i[1] === 'varies') {
            __label = `[ss sp]&nbsp;&nbsp;` + __label
            _available = data.sorcPoints[Object.keys(data.sorcPoints)[0]].value > 0;
        } else if (i[1]) {
            __label = `[${i[1]} sp]&nbsp;&nbsp;` + __label
            _available = data.sorcPoints[Object.keys(data.sorcPoints)[0]].value > i[1];
        };

        sorcInputs.push({
            label: __label,
            type: _available ? "radio" : "info",
            options: 'group1',
            value: i[0]
        })
    });

    let dialogData = await warpgate.menu(
    {
        inputs: sorcInputs,
        buttons: [{
            label: 'Choose',
            value: true,
            // callback: () => ui.notifications.info('Yes was clicked'),
        }, {
            label: 'Cancel',
            value: false
        }
        ]
        },
        {
          title: 'Metamagic',
          render: true,
          // render: (...args) => { console.log(...args); ui.notifications.info('render!')},
          // close: (resolve, ...args) => {ui.notifications.warn("Hey! you closed me!"); resolve(false)},
          options: {
            width: '300',
            height: '100%',    
          }
        }
    );

    // console.log(dialogData);

    if (dialogData.buttons) {
        const selected = dialogData.inputs.filter(i => !!i)[0]
        // console.log(selected);

        if (selected === "Convert Spell Slots") {
            var secondaryDialogInputs = [{
                    label: `<tr><th style="width:50%;text-align:left"><label>Sorcery Points:</label></th> <td>${_sorcPoints.value}/${_sorcPoints.max}</td></tr>`,
                    type: "info"
                },{
                    label: `<p style="text-align:center"><b>Choose spell slot level to covert</b></p>`,
                    type: "info"
                }];

            for (key in data.spellSlotsAvailable) {
                var __spellName = parseSpellName(key);
                var __spellLevel = parseInt(__spellName.charAt(0))

                if (__spellName !== 'Pact') {
                    var __available = (data.canOverflow || data.sorcPoints[Object.keys(data.sorcPoints)[0]].value < data.sorcPoints[Object.keys(data.sorcPoints)[0]].max) && data.spellSlots[key].value > 0;  

                    secondaryDialogInputs.push({
                        label: `[${__spellLevel} sp]&nbsp;&nbsp;&nbsp;&nbsp;<b>${__spellName}</b>&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:20px">${getSpellDots(key)}</span>`,
                        type: __available ? "radio" : "info",
                        options: "group2",
                        value: key
                    })
                } else if (__spellName === 'Pact') {
                    // pact spell slots needs an extra workaround
                }
            };

            let secondaryDialogData = await warpgate.menu({
                inputs: secondaryDialogInputs,
                buttons: [{
                    label: "Done",
                    value: true
                }, {
                    label: "Cancel",
                    value: false
                }],   
            }, {
                title: 'Convert Spell Slots',
                render: true,
                options: {
                    width: '300',
                    height: '100%',    
              }
            });

            // console.log(secondaryDialogData);

            if (secondaryDialogData.buttons && secondaryDialogData.inputs.filter(i => !!i).length > 0) {
                var __spell = secondaryDialogData.inputs.filter(i => !!i)[0];
                editSpellSlots(__spell, -1);
                editSorcPoints(parseInt(__spell.charAt(5)));
                playAnimation(lastArg.tokenId, "default");
                await createChatMessage('Convert Spell Slots', __spell);
                await updateActor(actor);
            }


        } else if (selected === "Create Spell Slots") {
            var secondaryDialogInputs = [{
                    label: `<tr><th style="width:50%;text-align:left"><label>Sorcery Points:</label></th> <td>${_sorcPoints.value}/${_sorcPoints.max}</td></tr>`,
                    type: "info"
                },{
                    label: `<p style="text-align:center"><b>Choose spell slot level to create</b></p>`,
                    type: "info"
                }];

            for (key in data.spellSlotsAvailable) {
                var __spellName = parseSpellName(key);
                var __spellLevel = parseInt(__spellName.charAt(0))

                if (__spellName !== 'Pact' && __spellLevel < 6) {
                    var __available =  data.spellSlotsMissing[key] > 0 && data.sorcPoints[Object.keys(data.sorcPoints)[0]].value >= data.cost[key] 

                    secondaryDialogInputs.push({
                        label: `[${data.cost[key]} sp]&nbsp;&nbsp;&nbsp;&nbsp;<b>${__spellName}</b>&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:20px">${getSpellDots(key)}</span>`,
                        // type: data.spellSlotsMissing[key] > 0 ? "radio" : "info",
                        type: __available ? "radio" : "info",
                        options: "group2",
                        value: key
                    })
                } else if (__spellName === 'Pact') {
                    // pact spell slots needs an extra workaround
                }
            };

            let secondaryDialogData = await warpgate.menu({
                inputs: secondaryDialogInputs,
                buttons: [{
                    label: "Done",
                    value: true
                }, {
                    label: "Cancel",
                    value: false
                }],   
            }, {
                title: 'Create Spell Slots',
                render: true,
                options: {
                    width: '300',
                    height: '100%',    
              }
            });

            // console.log(secondaryDialogData);

            if (secondaryDialogData.buttons &&  secondaryDialogData.inputs.filter(i => !!i).length > 0) {
                var __spell = secondaryDialogData.inputs.filter(i => !!i)[0];
                editSpellSlots(__spell, 1);
                editSorcPoints(-1 * data.cost[__spell]);
                playAnimation(lastArg.tokenId, "default");
                await createChatMessage('Create Spell Slots', __spell);
                await updateActor(actor);
            }
        } else if (selected === "Metamagic - Twinned Spell") {
             var secondaryDialogInputs = [{
                    label: `<tr><th style="width:50%;text-align:left"><label>Sorcery Points:</label></th> <td>${_sorcPoints.value}/${_sorcPoints.max}</td></tr>`,
                    type: "info"
                },{
                    label: `<p style="text-align:center"><b>Choose spell level to twin</b></p>`,
                    type: "info"
                }, {
                    label: `[1 sp]&nbsp;&nbsp;&nbsp;&nbsp;<b>Cantrip</b>`,
                    type: data.sorcPoints[Object.keys(data.sorcPoints)[0]].value > 0 ? "radio" : "info",
                    options: "group2",
                    value: "spell0"
                }];

            for (key in data.spellSlotsAvailable) {
                var __spellName = parseSpellName(key);
                var __spellLevel = parseInt(__spellName.charAt(0));

                if (__spellName !== 'Pact') {
                    var __available = data.spellSlotsAvailable[key][0] > 0 && data.sorcPoints[Object.keys(data.sorcPoints)[0]].value >= __spellLevel;

                    secondaryDialogInputs.push({
                        label: `[${__spellLevel} sp]&nbsp;&nbsp;&nbsp;&nbsp;<b>${__spellName}</b>&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:20px">${getSpellDots(key)}</span>`,
                        // type: data.spellSlotsMissing[key] > 0 ? "radio" : "info",
                        type: __available ? "radio" : "info",
                        options: "group2",
                        value: key
                    })
                } else if (__spellName === 'Pact') {
                    // pact spell slots needs an extra workaround
                }
            };

            let secondaryDialogData = await warpgate.menu({
                inputs: secondaryDialogInputs,
                buttons: [{
                    label: "Done",
                    value: true
                }, {
                    label: "Cancel",
                    value: false
                }],   
            }, {
                title: 'Twin Spell',
                render: true,
                options: {
                    width: '300',
                    height: '100%',    
              }
            });

            // console.log(secondaryDialogData);

            if (secondaryDialogData.buttons && secondaryDialogData.inputs.filter(i => !!i).length > 0) {
                var __spell = secondaryDialogData.inputs.filter(i => !!i)[0];
                editSorcPoints(__spell === 'spell0' ? -1 : -1 * __spell.charAt(5));
                playAnimation(lastArg.tokenId, "default");
                await rollItem("Metamagic - Twinned Spell");
                await updateActor(actor);
            }
        } else if (selected === "Bastion of Law") {
            var sorcCost = [];
            var maxSorcCost = _sorcPoints.value < 5 ? _sorcPoints.value : 5
            for (i = 1; i <= maxSorcCost; i++) {
                sorcCost.push(i)
            };

            var secondaryDialogInputs = [{
                    label: `<tr><th style="width:50%;text-align:left"><label>Sorcery Points:</label></th> <td>${_sorcPoints.value}/${_sorcPoints.max}</td></tr>`,
                    type: "info"
                },{
                    label: `<p style="text-align:center"><b>Spend sorcery points</b></p>`,
                    type: "select",
                    options: sorcCost
                }];

            let secondaryDialogData = await warpgate.menu({
                inputs: secondaryDialogInputs,
                buttons: [{
                    label: "Done",
                    value: true
                }, {
                    label: "Cancel",
                    value: false
                }],   
            }, {
                title: 'Bastion of Law',
                render: true,
                options: {
                    width: '300',
                    height: '100%',    
              }
            });

            console.log(secondaryDialogData);

            if (secondaryDialogData.buttons) {
                var __cost = secondaryDialogData.inputs.filter(i => !!i)[0];
                editSorcPoints(-1 * parseInt(__cost));
                playAnimation(lastArg.tokenId, "default");

                await lastArg.actor.setFlag('world', 'BastionOfLawCost', __cost)
                await rollItem("Bastion of Law");
                await updateActor(actor);
            }

        } else {
            editSorcPoints(-1 * data.items.filter(a => a.name === selected)[0].cost);
            playAnimation(lastArg.tokenId, "default");
            await rollItem(selected);
            await updateActor(actor);
        }
    }
}

// running script
getActorData(lastArg.actor);
checkSlotsAvailable();
checkSlotsMissing();
await runDialog(lastArg.actor);

// console.log(data);
// console.log('------------Sorcery Points macro end-------------')