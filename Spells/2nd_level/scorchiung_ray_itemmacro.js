const lastArg = args[args.length - 1];
let tactor;
if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
else tactor = game.actors.get(lastArg.actorId);
const casterToken = canvas.tokens.get(lastArg.tokenId);
// const target = canvas.tokens.get(lastArg.tokenId);
let itemlevel = args[1];  //passed by @item in the DAE field

// console.log(args);

async function selectTarget(missileNum) {
    content = `Choose target for ${missileNum} ray`;

    new Dialog({
        title: "Choose a target",
        content: content,      
        buttons: {
            ok: { label: "Done", callback: () => action = "Done" },
        },
        default: "none",

        close: html => {
            (async () => {
            if (action == "Done") 
            {
                tactor.items.getName("Scorching Ray (attack)").roll({"configureDialog": false});
            }
            })();
        }
    }).render(true);
}

if (args[0] === "on") {
        const updates = {
        embedded: {
            //create Scorching ray (attack) part of this spell
            Item: {
                "Scorching Ray (attack)": { 
                    "type": "spell",
                    "img": "icons/magic/light/beam-rays-red.webp",
                    
                    "data": {
                        "damage":{
                            "parts":[
                             ["2d6"
                             ,"fire"]
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
                            "value": `<p>You create ray of fire and hurl it at target within 120 feet. Make a ranged spell attack for each ray. On a hit, the target takes 2d6 fire damage.</p>`
                        },
                        "level": 2,
                        "school": "evo",
                    
                        "actionType": "rsak",

                        "uses": {
                            "value": 3 + itemlevel - 2,
                            "max": 3 + itemlevel - 2,
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
    ui.notifications.info(`Scorching Ray (attack) has been added to your At-Will spells.`);
    
    new Sequence()
        .effect()
            .file("jb2a.extras.tmfx.runes.circle.outpulse.evocation")
            .atLocation(casterToken)
            .duration(2000)
            .fadeIn(500)
            .fadeOut(500)
            .scale(0.5)
            .opacity(0.8)
            .filter("Glow", { color: 0xffa500 })
            .scaleIn(0, 500, { ease: "easeOutCubic", delay: 100 })
        .effect()
            .file("jb2a.smoke.puff.centered.dark_black")
            .atLocation(casterToken)
            .fadeIn(500)
            .fadeOut(500)
            .scale(0.5)
            .randomRotation()
        .play()

    for (var i = itemlevel; i >= 0; i--) {
        await selectTarget(i+1);
    }
}
if (args[0] === "off") {

    //Let's revert the token and remove the attack spell item
    await warpgate.revert(token.document)
    
}