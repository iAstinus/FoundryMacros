// declaring targets and caster tokens
const casterToken = canvas.tokens.get(args[0].tokenId);
if (!casterToken) {
    ui.notifications.warn("Please select a valid token to use this ability.");
    return;
}
const target = game.user.targets.first();
if (!target) {
    ui.notification.warn("This spell requires at least one valid target.");
    return;
}
let arrayLength = game.user.targets.size;

let spellTemplate = canvas.templates.get(args[0].templateId);
await spellTemplate.document.delete();

let casterTokenDocument = await await fromUuid(args[0].tokenUuid);
let casterDisposition = casterTokenDocument.disposition;


// primary animation of caster
let sequence = new Sequence()
    .effect()
        .file("jb2a.extras.tmfx.runes.circle.simple.evocation")
        .atLocation(casterToken)
        .fadeIn(500)
        .scaleIn(0, 300, {ease: "easeOutCubic"})
        .scaleToObject(4)
        .duration(1000)
        .fadeOut(500)
    .effect()
        .file("jb2a.cure_wounds.400px.blue")
        .atLocation(casterToken)
        .fadeIn(500)
        .fadeOut(500)
        .scaleToObject(3)
        .duration(1500)
        .waitUntilFinished(-1000)

// secondary animation on targets
for (let i = 0; i < arrayLength; i++) {
    let targetId = Array.from(game.user.targets)[i];
    if (targetId.document.disposition === casterDisposition) {
        sequence
            .effect()
                .file("jb2a.impact.003.blue")
                .atLocation(targetId)
                .fadeIn(500)
            .effect()
                .file("jb2a.healing_generic.loop.bluewhite")
                .atLocation(targetId)
                .fadeIn(500)
                .fadeOut(500)
                .scaleToObject(3)
                .belowTokens()
                .opacity(0.5)
            .effect()
                .file("jb2a.healing_generic.burst.bluewhite")
                .atLocation(targetId)
                .fadeIn(500)
                .fadeOut(500)
                .scaleToObject(3)
                .opacity(0.5)
    }
}

//play animation
sequence.play()