let tactor;
let itemname = "Absorb Elements";
if (args[0].tokenUuid) tactor = (await fromUuid(args[0].tokenUuid)).actor;
else tactor = game.actors.get(args[0].actorId);

let dialog = new Promise((resolve, reject) => {
    new Dialog({
        title: 'Choose a damage type',
        content: `
          <form class="flexcol">
            <div class="form-group">
              <select id="element">
                <option value="acid">Acid</option>
                <option value="cold">Cold</option>
                <option value="fire">Fire</option>
                <option value="lightning">Lightning</option>
                <option value="thunder">Thunder</option>
              </select>
            </div>
          </form>
        `,
        //select element type
        buttons: {
            yes: {
                icon: '<i class="fas fa-bolt"></i>',
                label: 'Select',
                callback: async (html) => {
                    let element = html.find('#element').val();
                    let effect =  tactor.effects.find(i => i.data.label === itemname);
                    let changes = duplicate(effect.data.changes);
                    changes[0].value = `${args[0].spellLevel}d6[${element}]`;
                    changes[1].value = `${args[0].spellLevel}d6[${element}]`;
                    await effect.update({changes});
                    effect =  tactor.effects.find(i => i.data.label === `${itemname} Resistance`);
                    changes = duplicate(effect.data.changes);
                    changes[0].value = element;
                    await effect.update({changes});
                    resolve();
                },
            },
        }
    }).render(true);
})
await dialog;

const casterToken = await fromUuid(args[0].tokenUuid);

new Sequence()
    .effect()
            .file("jb2a.extras.tmfx.runes.circle.inpulse.abjuration")
            .atLocation(casterToken)
            .duration(4500)
            .fadeIn(500)
            .fadeOut(500)
            .scale(0.5)
            .opacity(0.3)
            .filter("Glow", { color: 0xffffff })
            .scaleIn(0, 500, {ease: "easeOutCubic", delay: 100})
    .effect()
            .file("jb2a.extras.tmfx.border.circle.inpulse.02.normal")
            .fadeIn(500)
            .fadeOut(500)
            .duration(4500)
            .scale(0.3)
            .atLocation(casterToken)
            .belowTokens()
    .effect()
        .file("jb2a.shield.01.outro_explode.blue")
        .fadeIn(500)
        .fadeOut(100)
        .atLocation(casterToken)
        .waitUntilFinished(-500)
        .scale(0.4)
    .effect()
        .file("jb2a.shield.01.outro_explode.red")
        .fadeIn(100)
        .fadeOut(100)
        .atLocation(casterToken)
        .waitUntilFinished(-500)
        .scale(0.4)
    .effect()
        .file("jb2a.shield.01.outro_explode.green")
        .fadeIn(100)
        .fadeOut(100)
        .atLocation(casterToken)
        .waitUntilFinished(-500)
        .scale(0.4)
    .effect()
        .file("jb2a.shield.01.outro_explode.yellow")
        .fadeIn(100)
        .fadeOut(100)
        .atLocation(casterToken)
        .scale(0.4)
.play();