const casterToken = canvas.tokens.get(args[0].tokenId);
if (!casterToken) {
    ui.notifications.warn("Please select a valid token to use this ability.");
    return;
}
// get the template id from the canvas and its positions.
const spellTemplate = canvas.templates.get(args[0].templateId);
const templatePosition = {x: spellTemplate.document.x, y: spellTemplate.document.y};
// get an array of the targets within the tempalte area.
const targetLocations = Array.from(game.user.targets);

let sequence = new Sequence();

sequence.effect()
    .file("jb2a.extras.tmfx.runes.circle.inpulse.enchantment")
    .atLocation(casterToken)
    .duration(2000)
    .fadeIn(500)
    .fadeOut(500)
    .scale(0.5)
    .filter("Glow", { color: 0xa83299 })
    .waitUntilFinished(-500);

// sequence.effect()
//     .file("jb2a.fireball.beam.orange")
//     .atLocation(casterToken)
//     .stretchTo(spellTemplate)
//     .waitUntilFinished(-1800);

sequence.effect()
    .file("jb2a.magic_signs.circle.02.enchantment.complete.pink")
    .atLocation(templatePosition)
    .belowTokens()
    .scale(1)
    .waitUntilFinished(-7500);

// loop through targets and play only if failed save
for (let targetLoc of targetLocations) {
    sequence.effect()
        .file("jb2a.extras.tmfx.runes.circle.outpulse.enchantment")
        .filter("Glow", { color: 0xa83299 })
        .atLocation(targetLoc)
        .fadeIn(500)
        .fadeOut(500)
        .duration(2000)
        .scale(0.5);
    
    if (args[0].failedSaveUuids.includes(targetLoc.document.uuid)) {
        sequence.effect()
            .file("jb2a.energy_strands.complete.purple.01")
            .atLocation(targetLoc)
            .scaleToObject(0.8)
            .delay(2000)
            .fadeIn(500)
            .fadeOut(500)
            .persist()
            .name(`synaptic-static-${targetLoc.document.id}`)
    }
};

await spellTemplate.document.delete();
await sequence.play();
