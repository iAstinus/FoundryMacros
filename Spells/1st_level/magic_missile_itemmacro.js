// borrowed ideas from Sunbeam warpgate macro
// code goes to itemmacro, item has to be configured to deal no damage and target self
// and added effect lasting 1 turn with macro.ItemMacro CUSTOM @item.level

const lastArg = args[args.length - 1];
let tactor;
if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
else tactor = game.actors.get(lastArg.actorId);
const casterToken = canvas.tokens.get(lastArg.tokenId);
// const target = canvas.tokens.get(lastArg.tokenId);
let itemlevel = args[1];  //passed by @item in the DAE field

// console.log(args);

function selectTarget(missileNum) {
    content = `Choose target for ${missileNum} missile`;
    
    return new Promise((resolve, reject) => {
        const dialog = new Dialog({
            title: "Choose a target",
            content: content,      
            buttons: {
                ok: { label: "Done", callback: () => { resolve('Done'), tactor.items.getName("Magic missile (missile)").roll({"configureDialog": false}) } },
            },
            default: "none",

            close: () => { reject() }
            })
        dialog.render(true, options = {width: 200});
    }) 
}

if (args[0] === "on") {
        const updates = {
        embedded: {
            //create Scorching ray (attack) part of this spell
            Item: {
                "Magic missile (missile)": { 
                    "type": "spell",
                    "img": "icons/magic/fire/projectile-meteor-salvo-light-blue.webp",
                    
                    "data": {
                        "damage":{
                            "parts":[
                             ["1d4 + 1"
                             ,"force"]
                             ]
                        },
                        "preparation": {
                            "mode":"atwill"    
                        },
                        "activation":{
                            "type": "special",
                            "cost": 1,
                        },
                        "target":{
                            "value": 1,
                            "type":"creature"
                        },
                        "description": {
                            "value": `<p>You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within 120 feet. A dart deals 1d4 + 1 force damage to its target. </p>`
                        },
                        "level": 2,
                        "school": "evo",
                    
                        "actionType": "other",

                        "uses": {
                            "value": 3 + itemlevel - 1,
                            "max": 3 + itemlevel - 1,
                            "per": "charges"
                        }
                    },  
            
                    "flags": {
                            "favtab": {
                               "isFavorite": true
                            }
                    }
                }
            }
        }
    }

    //update the token and create the necessary attack spell
    await warpgate.mutate(token.document, updates);
    ui.notifications.info(`Magic missile (missile) has been added to your At-Will spells.`);
    
    new Sequence()
        .effect()
            .file("jb2a.extras.tmfx.runes.circle.outpulse.evocation")
            .atLocation(casterToken)
            .duration(2000)
            .fadeIn(500)
            .fadeOut(500)
            .scale(0.5)
            .opacity(0.8)
            .filter("Glow", { color: 0xffffff })
            .scaleIn(0, 500, { ease: "easeOutCubic", delay: 100 })
        .effect()
            .file("jb2a.smoke.puff.centered.dark_black")
            .atLocation(casterToken)
            .fadeIn(500)
            .fadeOut(500)
            .scale(0.5)
            .randomRotation()
        .play()

    for (var i = 0; i <= itemlevel + 1; i++) {
        const dialogOutput = await selectTarget(i+1);
    }
}
if (args[0] === "off") {

    //Let's revert the token and remove the attack spell item
    await warpgate.revert(token.document)
    
}