// requires Perfect Vision and Token magic modules

// console.log('---macro start---');
// console.log(args);

const casterToken = canvas.tokens.get(args[0].tokenId);
const template = canvas.templates.get(args[0].templateId);

const gridSize = canvas.grid.size;
const texture = "modules/jb2a_patreon/Library/1st_Level/Fog_Cloud/FogCloud_02_Regular_White_800x800.webm";
const textureSize = 800;
const spellLevel = args[0].spellLevel;
// const textureTest = await loadTexture("modules/jb2a_patreon/Library/1st_Level/Fog_Cloud/FogCloud_02_Regular_White_800x800.webm");
// const textureSize = textureTest.width;

new Sequence()
    .effect()
        .file("jb2a.extras.tmfx.runes.circle.outpulse.conjuration")
        .atLocation(casterToken)
        .duration(4000)
        .fadeIn(500)
        .fadeOut(500)
        .scale(0.5)
        .waitUntilFinished(-2000)
        .filter("Glow", { color: 0x8C8A93 })
    .effect()
        .file(texture)
        .atLocation(template.document)
        .scale(10*spellLevel*gridSize*0.8/textureSize)
        .scaleIn(0.1, 2000, {ease: "easeOutCubic"})
        .duration(3000)
.play();


await Sequencer.Helpers.wait(5000);
// updating template:
template.document.update({
    "texture": texture,
    "distance": 20*spellLevel, 
    "flags": {
        "perfect-vision": {
            "visionLimitation": {
                "enabled": true,
                "sight": 5
            }
        },
        "tokenmagic": {
            "templateData": {
                "opacity": 0.65
            }
        }
    },
    "fillColor": "#8c8a93",
});

// console.log('---macro end---')