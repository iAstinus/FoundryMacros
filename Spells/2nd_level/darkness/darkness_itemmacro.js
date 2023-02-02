// requires Perfect Vision and Token magic modules

// console.log('---macro start---');
// console.log(args);

const casterToken = canvas.tokens.get(args[0].tokenId);
const template = canvas.templates.get(args[0].templateId);

const gridSize = canvas.grid.size;
const texture = "modules/jb2a_patreon/Library/2nd_Level/Darkness/Darkness_01_Black_600x600.webm";
const textureSize = 600;
const spellLevel = args[0].spellLevel;
// const textureTest = await loadTexture(texture);
// const textureSize = textureTest.width;

new Sequence()
    .effect()
        .file("jb2a.extras.tmfx.runes.circle.outpulse.evocation")
        .atLocation(casterToken)
        .duration(4000)
        .fadeIn(500)
        .fadeOut(500)
        .scale(0.5)
        .waitUntilFinished(-2000)
        .filter("Glow", { color: 0x0a0a0a })
    .effect()
        .file(texture)
        .atLocation(template.document)
        .scale(7.5*gridSize*0.8/textureSize)
        .scaleIn(0.1, 2000, {ease: "easeOutCubic"})
        .duration(3000)
.play();


await Sequencer.Helpers.wait(5000);
// updating template:
template.document.update({
    "texture": texture,
    // "distance": 15, 
    "flags": {
        "perfect-vision": {
            "visionLimitation": {
                "enabled": true,
                "sight": 5
            }
        },
        "tokenmagic": {
            "templateData": {
                "opacity": 0.95
            }
        }
    },
    "fillColor": "#0a0a0a",
});

// console.log('---macro end---')