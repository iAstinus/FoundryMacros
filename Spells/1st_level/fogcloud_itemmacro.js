// Credits to DDB Darkness macro
// Instead of onUse dgoes to DAE macro.ItemMacro (w/o any params)
// need an additional global macro "fogcloud-effect-macro", which mus be set to be executed as GM, so playrs can crate walls, lights and tiles

if (!game.modules.get("advanced-macros")?.active) ui.notifications.error("Please enable the Advanced Macros module");

const lastArg = args[args.length - 1];
const tokenOrActor = await fromUuid(lastArg.actorUuid);
const targetActor = tokenOrActor.actor ? tokenOrActor.actor : tokenOrActor;

const gmMacroName = "fogcloud-effect-macro";

if (args[0] === "on") {
  Hooks.once("createMeasuredTemplate", async (template) => {
    let radius = canvas.grid.size * (template.data.distance / canvas.grid.grid.options.dimensions.distance);
    const fogSpellParams = {
      radius,
      x: template.data.x,
      y: template.data.y,
      distance: template.data.distance,
      targetActorId: targetActor.id,
    };
    await DAE.setFlag(targetActor, "fogSpell", fogSpellParams);
    canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", [template.id]);
    const gmMacro = game.macros.find(m => m.name === gmMacroName);
    gmMacro.execute("on", fogSpellParams);
  });

  const measureTemplateData = {
    t: "circle",
    user: game.userId,
    distance: 20,
    direction: 0,
    x: 0,
    y: 0,
    fillColor: game.user.color,
    flags: {
      spellEffects: {
        FogCloud: {
          ActorId: targetActor.id,
        },
      },
    },
  };

  const doc = new CONFIG.MeasuredTemplate.documentClass(measureTemplateData, { parent: canvas.scene });
  const measureTemplate = new game.dnd5e.canvas.AbilityTemplate(doc);
  measureTemplate.actorSheet = targetActor.sheet;
  measureTemplate.drawPreview();
}

if (args[0] === "off") {
  const params = await DAE.getFlag(targetActor, "fogSpell");
  const gmMacro = game.macros.find(m => m.name === gmMacroName);
  gmMacro.execute("off", params);
  await DAE.unsetFlag(targetActor, "fogSpell");
}