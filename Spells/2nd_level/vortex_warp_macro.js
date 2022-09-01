// console.log(args);
    //DAE Macro Execute, Effect Value = "Macro Name" @target

class Macros {

    static targets(args) {
        const lastArg = args[args.length - 1];
        let tactor, ttoken;
        if (lastArg.tokenId) {
            ttoken = canvas.tokens.get(lastArg.tokenId);
            tactor = ttoken.actor
        }
        else tactor = game.actors.get(lastArg.actorId);
        return { actor: tactor, token: ttoken, lArgs: lastArg }
    }
    /**
     * 
     * @param {Object} templateData 
     * @param {Actor5e} actor 
     */
    static templateCreation(templateData, actor) {
        let doc = new CONFIG.MeasuredTemplate.documentClass(templateData, { parent: canvas.scene })
        let template = new game.dnd5e.canvas.AbilityTemplate(doc)
        template.actorSheet = actor.sheet;
        template.drawPreview()
    }

    /**
     * 
     * @param {String} flagName 
     * @param {Actor5e} actor 
     */
    static async deleteTemplates(flagName, actor) {
        let removeTemplates = canvas.templates.placeables.filter(i => i.data.flags["midi-srd"]?.[flagName]?.ActorId === actor.id);
        let templateArray = removeTemplates.map(function (w) { return w.id })
        if (removeTemplates) await canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", templateArray)
    };

    static async vortexWarp(args) {
        //DAE Macro Execute, Effect Value = "Macro Name" @target 
        if (!game.modules.get("advanced-macros")?.active) ui.notifications.error("Please enable the Advanced Macros module")
        const { actor, token, lArgs } = Macros.targets(args)
        let casterToken = canvas.tokens.get(args[1]);
        console.log('Caster Data:', casterToken);

        // let sequence = new Sequence()
        //     .effect()
        //         .file("modules/jb2a_patreon/Library/2nd_Level/Misty_Step/MistyStep_01_Regular_Blue_400x400.webm")
        //         .atLocation(token)
        //         .scale(0.35)
        //     .wait(1000)
        //     .animation()
        //         .on(token)
        //         .teleportTo({
        //             x: template.data.x,
        //             y: template.data.y 
        //         })
        //         .waitUntilFinished()
        //     .effect()
        //         .file("modules/jb2a_patreon/Library/2nd_Level/Misty_Step/MistyStep_02_Regular_Blue_400x400.webm")
        //         .atLocation(token)
        //         .scale(0.5)

        if (args[0] === "on") {
            let range = canvas.scene.createEmbeddedDocuments("MeasuredTemplate", [{
                t: "circle",
                user: game.user._id,
                x: casterToken.x + canvas.grid.size / 2,
                y: casterToken.y + canvas.grid.size / 2,
                direction: 0,
                distance: 90,
                borderColor: "#FF0000",
                flags: { "midi-srd": { VortexWarp: { ActorId: actor.id } } }
            }]);
            range.then(result => {
                let templateData = {
                    t: "rect",
                    user: game.user._id,
                    distance: 7.5,
                    direction: 45,
                    x: 0,
                    y: 0,
                    fillColor: game.user.color,
                    flags: { "midi-srd": { VortexWarp: { ActorId: actor.id } } }
                };
                Hooks.once("createMeasuredTemplate", deleteTemplatesAndMove);
                Macros.templateCreation(templateData, actor)
                
                async function deleteTemplatesAndMove(template) {
                    Macros.deleteTemplates("VortexWarp", actor)
                    await new Sequence()
                        .effect()
                            .file("modules/jb2a_patreon/Library/2nd_Level/Misty_Step/MistyStep_01_Regular_Orange_400x400.webm")
                            .atLocation(token)
                            .scale(0.35)
                        .wait(1000)
                        .animation()
                            .on(token)
                            .teleportTo({
                                x: template.data.x,
                                y: template.data.y 
                            })
                            .waitUntilFinished()
                        .effect()
                            .file("modules/jb2a_patreon/Library/2nd_Level/Misty_Step/MistyStep_02_Regular_Orange_400x400.webm")
                            .atLocation(token)
                            .scale(0.5)
                        .play();
                    // await token.document.update({ x: template.data.x, y: template.data.y }, { animate: false })
                    await actor.deleteEmbeddedDocuments("ActiveEffect", [lArgs.effectId]);
                };
            });
        }
    }
};

Macros.vortexWarp(args);