// credits to sample Midi Items
// requires Lay on Hands Pool primary resource
// must be called before the item is rolled

const version = "10.0.10";
try {
    if (args[0].macroPass === "preItemRoll") {
      const theTarget = args[0].targets[0];
      if (!theTarget) return false;
    
      // does not work on undead/constructs
      let invalid = ["undead", "construct"].some(type => (theTarget?.actor.system.details.type?.value || "").toLowerCase().includes(type));
      if (invalid) {
          ui.notifications.warn("Lay on Hands can't affect undead/constructs")
          return false;
      }
      let consumeTarget = args[0].itemData.system.consume.target;
      if (!consumeTarget || consumeTarget === "") consumeTarget = 'resources.primary.value'; 
      const available = getProperty(actor.system, consumeTarget);
      // Have we got any left?
      if (available <= 0) return false;
    
      // prompt for how much to use...
      let d = new Promise((resolve, reject) => {
        let theDialog = new Dialog({
          title: "Lay on Hands",
          content: `How many points to use? ${available} available<input id="mqlohpoints" type="number" min="0" step="1.0" max="${available}"></input>`,
          buttons: {
            heal: {
              label: "Heal",
              callback: (html) => { resolve(Math.clamped(Math.floor(Number(html.find('#mqlohpoints')[0].value)), 0, available)); }
            },
            cureDiseasePoison: {
              label: "Disease/Poison",
              callback: (html) => { resolve(-Math.clamped(Math.floor(Number(html.find('#mqlohpoints')[0].value) / 5) * 5, 0, available)); }
            },
            abort: {
              icon: '<i class="fas fa-cross"></i>',
              label: "Quit",
              callback: () => { resolve(false) }
            },
          },
          default: "heal",
        }).render(true);
      });
      const consumed = await d;
      if (!consumed) return false;
      const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
      const theItem = workflow.item;
      let updates;
      if (consumed > 0) {
        updates = {
          "system.consume.amount": Math.abs(consumed),
          "system.damage.parts": [[`${Math.max(0, consumed)}`, "healing"]],
          "system.chatFlavor": "",
          "system.consume.target": consumeTarget
        };
      } else {
        updates = {
          "system.consume.amount": Math.abs(consumed),
          "system.damage.parts": [],
          "system.chatFlavor": `<h3>Remove up to ${Math.floor(Math.abs(consumed) / 5)} poisons/diseases</h3>`,
          "system.consume.target": consumeTarget
        };
      }
      setProperty(workflow, "workflowOptions.autoConsumeResource", true);
      setProperty(workflow, "options.configureDialog", false);
      let casterToken = canvas.tokens.get(args[0].tokenId);
      // const theTarget = game.user.targets.first();

      new Sequence()
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
        .effect()
            .file("jb2a.impact.003.blue")
            .atLocation(theTarget)
            .fadeIn(500)
        .effect()
            .file("jb2a.healing_generic.loop.bluewhite")
            .atLocation(theTarget)
            .fadeIn(500)
            .fadeOut(500)
            .scaleToObject(3)
            .belowTokens()
            .opacity(0.5)
        .effect()
            .file("jb2a.healing_generic.burst.bluewhite")
            .atLocation(theTarget)
            .fadeIn(500)
            .fadeOut(500)
            .scaleToObject(3)
            .opacity(0.5)       
      .play();

      return theItem.update(updates);
    }
    return true;
} catch (err)  {
    console.error(`${args[0].itemData.name} - Lay on Hands ${version}`, err);
}