// WIP

console.log(args);
//DAE Macro Execute, Effect Value = "Macro Name" t @damage (apply @mod damge of none type)
const lastArg = args[args.length - 1];
let tactor;
if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
else tactor = game.actors.get(lastArg.actorId);
const target = canvas.tokens.get(lastArg.tokenId)

let mod = args[1];

if (args[0] === "on") {
    ChatMessage.create({ content: `Heroism is applied to ${tactor.name}` })
}
if (args[0] === "off") {
    ChatMessage.create({ content: "Heroism ends" });
}
if(args[0] === "each"){
let bonus = mod > tactor.data.data.attributes.hp.temp ? mod : tactor.data.data.attributes.hp.temp
    tactor.update({ "data.attributes.hp.temp": mod });
    ChatMessage.create({ content: "Heroism continues on " + tactor.name })
}

const casterToken = canvas.tokens.get(lastArg.tokenId);
if (!casterToken) {
    ui.notifications.warn("Please select a valid token to use this ability.");
    return;
}

let target = lastArg.targets[0];

new Sequence()

.effect()
    .file("jb2a.extras.tmfx.runes.circle.inpulse.enchantment")
    .atLocation(casterToken)
    .duration(2000)
    .fadeIn(500)
    .fadeOut(500)
    .scale(0.5)
    .waitUntilFinished(-500)

.effect()
    .file("jb2a.markers.light.loop.blue")
    .atLocation(casterToken)
    .duration(1500)
    .fadeIn(500)
    .fadeOut(500)
    .waitUntilFinished(-500)

.effect()
    .file("jb2a.swirling_sparkles.01.blue")
    .atLocation(target)
    .waitUntilFinished(-250)

.effect()
    .file(target.data.texture.src)
    .fadeOut(500)
    .atLocation(target)
    .scaleIn(0, 500, { ease: "easeInCubic", delay: 0 })
    .scaleToObject(3)
    .waitUntilFinished(-250)

.effect()
    .file(target.data.texture.src)
    .fadeOut(500)
    .atLocation(target)
    .scaleIn(0, 500, { ease: "easeInCubic", delay: 0 })
    .scaleToObject(3)
    .waitUntilFinished(-250)

.effect()
    .file("jb2a.ward.star.yellow.02")
    .atLocation(target)
    .fadeIn(500)
    .fadeOut(500)
    .scaleToObject(2.5)
    .persist()
    .belowTokens()

.play()