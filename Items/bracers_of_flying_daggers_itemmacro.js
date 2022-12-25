// console.log("---macro start---");
// console.log(args);

const lastArg = args[args.length - 1];
let tactor;
if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
else tactor = game.actors.get(lastArg.actorId);
const casterToken = canvas.tokens.get(lastArg.tokenId);

function selectTarget(missileNum) {
    content = `Choose target for ${missileNum} dagger`;
    
    return new Promise((resolve, reject) => {
        const dialog = new Dialog({
            title: "Choose a target",
            content: content,      
            buttons: {
                ok: { label: "Done", callback: () => { resolve('Done'), tactor.items.getName("Dagger").roll({"configureDialog": false}) } },
            },
            default: "none",

            close: () => { reject() }
            })
        dialog.render(true, options = {width: 200, left: canvas.screenDimensions[0] * 0.7});
    }) 
}

for (var i = 1; i <= 2; i++) {
    await selectTarget(i);
}

// console.log("---macro end---")