// credits to Tyreal7

const casterToken = canvas.tokens.get(args[0].tokenId);
if (!casterToken) {
    ui.notifications.warn("Please select a valid token to use this ability.");
    return;
}
//get the template id from the canvas and its positions.
// const templateLocation = canvas.templates.placeables[canvas.templates.placeables.length - 1];
const spellTemplate = canvas.templates.get(args[0].templateId);
//get an array of the targets within the tempalte area.
const targetLocations = Array.from(game.user.targets);

// console.log(spellTemplate);

let sequence = new Sequence();

sequence.effect()
    .file("jb2a.extras.tmfx.runes.circle.inpulse.evocation")
    .atLocation(casterToken)
    .duration(2000)
    .fadeIn(500)
    .fadeOut(500)
    .scale(0.5)
    .filter("Glow", { color: 0xffa500 })
    .waitUntilFinished(-500);

sequence.effect()
    .file("jb2a.fireball.beam.orange")
    .atLocation(casterToken)
    .stretchTo(spellTemplate)
    .waitUntilFinished(-1800);

sequence.effect()
    .file("jb2a.fireball.explosion.orange")
    .atLocation(spellTemplate)
    .scale(1.4)
    .waitUntilFinished(-2100);

//blast mark from the forgotten adventures site, you need to find your own blast mark or use the agreed one by JB2A and FA
sequence.effect()
    .file("jb2a.impact.ground_crack.still_frame.01")
    .atLocation(spellTemplate)
    .fadeIn(300)
    .duration(10000)
    .fadeOut(350)
    .name(`fireball-impact-${spellTemplate.document.data._id}`)
    .belowTokens();

//loop through targets and play only if failed save (to do)
for (let targetLoc of targetLocations) {
    sequence.effect()
        .file("jb2a.flames.01.orange")
        .filter("Glow", { color: 0xffa700 })
        .atLocation(targetLoc)
        .fadeIn(500)
        .fadeOut(500)
        .duration(2000);
}
// sequence.thenDo(() => canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", [templatePosition.data._id]));
await sequence.play();
await spellTemplate.document.delete()