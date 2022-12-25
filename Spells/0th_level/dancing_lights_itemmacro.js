// credits to Tyreal74
// added concentration handler hook for midi

const casterToken = canvas.tokens.get(args[0].tokenId);
if (!casterToken) {
    ui.notifications.warn("Please select a valid token to use this ability.");
    return;
}

let updates = {
    token : {
        'flags': {"tagger": {'tags': [args[0].actor._id]}}
    }
}

let dancingLightCount = 1;
let currentDancingLightCount = 0;
let hasPlayedAnimation = false;
let createDancingLight = undefined;
if (!createDancingLight) {
    createDancingLight = async () => {
        if (typeof dancingLightCount !== "number" || dancingLightCount <= 0)
            return;

        await warpgate.spawn("Dancing Light", updates, {
            pre: async (location, updates) => {
                // When the user has clicked where they want it

                if (!hasPlayedAnimation) {
                    hasPlayedAnimation = true;
                    new Sequence()
                        .effect()
                            .file("jb2a.extras.tmfx.runes.circle.outpulse.evocation")
                            .atLocation(casterToken)
                            .duration(2000)
                            .fadeIn(500)
                            .fadeOut(500)
                            .scale(0.5)
                            .filter("Glow", { color: 0xffffbf })
                            .scaleIn(0, 500, {ease: "easeOutCubic", delay: 100})
                        .effect()
                            .file("jb2a.moonbeam.01.intro.blue")
                            .atLocation(casterToken)
                            .fadeIn(100)
                            .fadeOut(200)
                            .duration(1200)
                    .play();
                }
            },
            post: async (location, spawnedToken, updates, iteration) => {
                // When the token has been spawned

                new Sequence()
                .effect()
                    .file("jb2a.toll_the_dead.blue.shockwave")
                    .atLocation(location)
                    .fadeOut(500)
                    .randomRotation()
                    .scale(0.5)
                .play();


                if (++currentDancingLightCount < dancingLightCount) {
                    await createDancingLight();
                }
            }
        }, {
            controllingActor: casterToken.actor,
            collision: false,
        });
    }
}

new Dialog({
    title: "Dancing Lights",
    content: `
        <div class="form-group">
            <label>Dancing Light Count: <span id="dancing-light-count">4</span></label>
            <input type="range" id="dancing-light-range" value="4" min="1" max="4" oninput="$('#dancing-light-count').html(this.value)"/>
        </div>
    `,
    buttons: {
        one: {
            label: "Done",
            callback: (html) => {
                dancingLightCount = parseInt(html.find("#dancing-light-range").val());
                createDancingLight();
            }
        }
    },
    default: "one"
}).render(true);

Hooks.once("deleteActiveEffect", concentrationHandler);

async function concentrationHandler(activeEffect) {
    // console.log("Concentration: ", activeEffect);

    for (const tokenData of canvas.tokens.placeables.map(a => [a.id, a.document.flags.tagger])) {
        // console.log(tokenData)
        if (tokenData[1] != null) {
            if (tokenData[1]['tags'].includes(args[0].actor._id)) {
                await warpgate.dismiss(tokenData[0]);
            }
        }
    }
    return;
}