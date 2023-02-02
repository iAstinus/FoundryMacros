// This Macro is called by the Fog Cloud spell so players can place walls and lights.
// Should be executed as GM

const fogParams = args[args.length - 1];
console.log(fogParams);

function circleWall(cx, cy, radius) {
  let walls = [];
  const step = 30;
  for (let i = step; i <= 360; i += step) {
    let theta0 = Math.toRadians(i - step);
    let theta1 = Math.toRadians(i);

    let lastX = Math.floor(radius * Math.cos(theta0) + cx);
    let lastY = Math.floor(radius * Math.sin(theta0) + cy);
    let newX = Math.floor(radius * Math.cos(theta1) + cx);
    let newY = Math.floor(radius * Math.sin(theta1) + cy);

    walls.push({
      c: [lastX, lastY, newX, newY],
      move: CONST.WALL_MOVEMENT_TYPES.NONE,
      light: CONST.WALL_SENSE_TYPES.NORMAL,
      sight: CONST.WALL_SENSE_TYPES.NORMAL,
      sound: CONST.WALL_SENSE_TYPES.NONE,
      dir: CONST.WALL_DIRECTIONS.BOTH,
      door: CONST.WALL_DOOR_TYPES.NONE,
      ds: CONST.WALL_DOOR_STATES.CLOSED,
      flags: {
        spellEffects: {
          Darkness: {
            ActorId: fogParams.targetActorId,
          },
        },
      },
    });
  }

  canvas.scene.createEmbeddedDocuments("Wall", walls);
}

function fogLight(cx, cy, radius) {
  const lightTemplate = {
    x: cx,
    y: cy,
    rotation: 0,
    walls: false,
    vision: false,
    config: {
      alpha: 1,
      angle: 0,
      bright: radius,
      coloration: 1,
      dim: 0,
      gradual: false,
      luminosity: -0.05,
      saturation: 0,
      contrast: 0,
      shadows: 0,
      animation: {
        speed: 5,
        intensity: 5,
        reverse: false,
      },
      darkness: {
        min: 0,
        max: 1,
      },
      color: "#ffffff",
    },
    hidden: false,
    flags: {
      spellEffects: {
        FogCloud: {
          ActorId: fogParams.targetActorId,
        },
      },
      "perfect-vision": {
        sightLimit: 0,
        visionLimitation: {
          sight: 5,
          enabled: true,
          detection: {
            basicSight: 5,
            seeAll: 5,
            seeInvisibility: 5
          }
        }
      },
    },
  };
  canvas.scene.createEmbeddedDocuments("AmbientLight", [lightTemplate]);
}

function fogTile(cx, cy, radius) {
  const pHeight = 2*canvas.grid.size*radius/canvas.grid.grid.options.dimensions.distance;
  const pWidth = 2*canvas.grid.size*radius/canvas.grid.grid.options.dimensions.distance;
  const centerOffset = canvas.grid.size*radius/canvas.grid.grid.options.dimensions.distance;

  const tileTemplate = {
    alpha: 0.7,
    
    height: pHeight,
    width: pWidth,
    x: cx - centerOffset,
    y: cy - centerOffset,
    z: 100,

    hidden: false,
    overhead: true,
    roof: true,
    rotation: 0,
    texture: {
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        tint: null,
        src: "modules/jb2a_patreon/Library/1st_Level/Fog_Cloud/FogCloud_01_White_800x800.webm"
    },
    video: {
        autopay: true,
        loop: true,
        volume: 0
    },
    occlusion: {
        alpha: 0.2,
        mode: 3
    },
    flags: {
        // "betterroofs": {
        // },
        spellEffects: {
            FogCloud: {
                ActorId: fogParams.targetActorId,
            }
        },
        // "monk-active-tiles": {
        // }
    }
  };
  canvas.scene.createEmbeddedDocuments("Tile", [tileTemplate]);
}

if (args[0] == "on") {
  if (!game.modules.get("perfect-vision")?.active) circleWall(fogParams.x, fogParams.y, fogParams.radius);
  fogLight(fogParams.x, fogParams.y, fogParams.distance);
  fogTile(fogParams.x, fogParams.y, fogParams.distance);
}

if (args[0] == "off") {
  const fogWalls = canvas.walls.placeables.filter((w) => w.data.flags?.spellEffects?.FogCloud?.ActorId === fogParams.targetActorId);
  const wallArray = fogWalls.map((w) => w.id);
  const fogLights = canvas.lighting.placeables.filter((w) => w.data.flags?.spellEffects?.FogCloud?.ActorId === fogParams.targetActorId);
  const lightArray = fogLights.map((w) => w.id);
  const fogTiles = canvas.tiles.placeables.filter((w) => w.data.flags?.spellEffects?.FogCloud?.ActorId === fogParams.targetActorId);
  const tileArray = fogTiles.map((w) => w.id);
  await canvas.scene.deleteEmbeddedDocuments("Wall", wallArray);
  await canvas.scene.deleteEmbeddedDocuments("AmbientLight", lightArray);
  await canvas.scene.deleteEmbeddedDocuments("Tile", tileArray);
}