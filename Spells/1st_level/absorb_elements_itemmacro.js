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