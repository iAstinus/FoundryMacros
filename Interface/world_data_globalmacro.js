// borrowed from M.A.

/**
 * Generates simplistic and more or less accurate report on data needed for initial load on top of what an empty world load would require.
 *
 * This is based mostly on viewed scene, all actors, all items directory content, and chat log.
 *
 * View the active/default scene to get more accurate idea of initial load. The flexibility is provided as compromise for not analyzing all scenes.
 *
 * TODO:
 * - Scrub duplicate images. They're loaded only once.
 */

const strippedBaseURI = document.baseURI.replace(/[^/]+$/, '');

const kbSize = (size) => Math.floor(size / 100) / 10;
const mbSize = (size) => Math.floor(size / 10_000) / 100;
const typedSize = (size) => size > 500_000 ? [mbSize(size), 'MB'] : [kbSize(size), 'kB'];

const imgSize = async (path) => {
    if (!path) return 0;

    return new Promise(
        (clen) => fetch(path, { method: 'HEAD', redirect: 'manual' })
            .catch(() => { clen(0); })
            .then((rs) => clen(parseInt(rs?.headers?.get('Content-Length') ?? '0', 10)))
    );
}

const transferSize = (doc) => JSON.stringify(doc.toObject()).length;

(async () => {
    const actors = [];
    let fattestActor = { name: null, id: null, transferSize: 0, imgSize: 0, tokenSize: 0, totalSize: 0 };
    const actorArr = game.actors.filter(a => a.permission >= 3);

    ui.notifications.info(`Analyzing ${actorArr.length} actors...`);

    console.log('... processing actors');
    for (const actor of actorArr) {
        const nada = {
            name: actor.name,
            id: actor.id,
            transferSize: transferSize(actor),
            imgSize: await imgSize(actor.img), // profile image
            tokenSize: await imgSize(actor.data.token?.img), // token image
            get totalSize() {
                return this.transferSize + this.imgSize + this.tokenSize;
            },
        };
        actors.push(nada);
        if (nada.totalSize > fattestActor.totalSize) fattestActor = nada;
    }

    ui.notifications.info('Analyzing scenes...');
    console.log('... processing scenes');
    const scnV = game.scenes.viewed;
    const scnA = game.scenes.active;

    async function analyzeScene(scene) {
        if (!scene) return null;
        console.log('... processing scene:', scene.id);
        let templateImages = 0, tileImages = 0, templateCount = 0, tileCount = 0, tokenImages = 0, tokenCount = 0, tokenData = 0;
        for (const t of scene.templates) {
            templateImages += await imgSize(t.img);
            templateCount++;
        }
        for (const t of scene.tiles) {
            tileImages += await imgSize(t.img);
            tileCount++;
        }
        for (const t of scene.tokens) {
            if (!t.isLinked) { // count token images only if they're unlinked, otherwise they're part of actor data
                tokenImages += await imgSize(t.data.img);
                tokenData += transferSize(t);
            }
            tokenCount++;
        }
        const sceneData = {
            transferSize: transferSize(scene),
            imgSize: await imgSize(scene.img),
            templateImages,
            templateCount,
            tileImages,
            tokenCount,
            tokenImages,
            tokenData,
            get totalSize() {
                return this.transferSize + this.imgSize + this.templateImages + this.tileImages;
            },
        };

        return sceneData;
    }

    const sceneA = await analyzeScene(scnA);
    const sceneV = scnA?.id === scnV?.id ? null : await analyzeScene(scnV);

    // Analyze items

    const itemArr = game.items.filter(i => i.permission >= 3);
    ui.notifications.info(`Analyzing items directory (${itemArr.length} items)...`);
    console.log('... processing items directory');
    const items = [];
    for (const item of itemArr) {
        const nida = {
            name: item.name,
            id: item.id,
            transferSize: transferSize(item),
            img: item.img,
            imgSize: await imgSize(item.img),
            get totalSize() {
                return this.transferSize + this.imgSize
            },
        };
        items.push(nida);
    }

    // Analyze log

    ui.notifications.info(`Analyzing chat log (${game.messages.contents.length} messages)...`);
    console.log('... processing chat log');

    const log = {
        count: 0,
        transferSize: 0,
        imgSize: 0,
        get totalSize() {
            return this.transferSize + this.imgSize
        },
    };

    for (const cm of game.messages.contents) {
        log.count++;
        log.transferSize += transferSize(cm);
    }

    // Collate results

    console.log('... results!');

    const col = () => $('<div>').addClass('flexcol');
    const row = () => $('<div>').addClass('flexrow').css({ 'flex-wrap': 'nowrap', 'flex': '0' });
    const label = (text) => $('<label>').text(text).css({ 'white-space': 'nowrap' });
    const h2 = (text) => $('<h2>').text(text);
    const h3 = (text) => $('<h3>').text(text).css({ margin: '0', 'margin-top': '0.3em', 'font-weight': 'bold' });
    const sizeString = (size) => {
        const [n, l] = typedSize(size);
        return `${n} ${l}`;
    }

    const darkBg = () => { return { 'background-color': 'rgba(0,0,0,0.05)' } };
    const numberS = () => { return { flex: '0 5em', 'text-align': 'right' } };
    const leftLabel = () => { return { flex: '1 12em' } };
    const bolded = () => { return { 'font-weight': 'bold' } };

    const html = col();

    const actorTotalTransfer = actors.reduce((a, x) => a + x.transferSize, 0),
        actorTotalImgs = actors.reduce((a, x) => a + x.imgSize + x.tokenSize, 0);
    const itemTotalTransfer = items.reduce((a, x) => a + x.transferSize, 0),
        itemTotalImgs = items.reduce((a, x) => a + x.imgSize, 0);
    console.log('ACTORS:', actors.length, 'entities;', ...typedSize(actorTotalTransfer), 'data;', ...typedSize(actorTotalImgs), 'images');

    const totalTransfer = actorTotalTransfer + (sceneA?.transferSize ?? 0) + (sceneV?.transferSize ?? 0) + itemTotalTransfer + log.totalSize;
    const totalImages = actorTotalImgs + (sceneA?.imgSize ?? 0) + (sceneV?.imgSize ?? 0) + itemTotalImgs;
    const totalData = totalTransfer + totalImages;

    /** SCENE */

    const sceneRow = row();
    html.append(sceneRow);

    function renderSceneData(scene, scnlabel) {
        sceneRow.append(col().append(
            row().append(h2(scnlabel)),
            row().css(darkBg()).append(label('').css(leftLabel()), label('Count').css(numberS()), label('Data').css(numberS()), label('Images').css(numberS()), label('Total').css(numberS())),
            row().append(label('Base').css(leftLabel()), label('').css(numberS()), label(sizeString(scene.transferSize)).css(numberS()), label(sizeString(scene.imgSize)).css(numberS()), label(sizeString(scene.totalSize)).css(numberS()).css(bolded())),
            row().append(label('Templates').css(leftLabel()), label(scene.templateCount).css(numberS()), label('').css(numberS()), label(sizeString(scene.templateImages)).css(numberS()), label('').css(numberS())),
            row().append(label('Tiles').css(leftLabel()), label(scene.tileCount).css(numberS()), label('').css(numberS()), label(sizeString(scene.tileImages)).css(numberS()), label('').css(numberS())),
            row().append(label('Tokens').css(leftLabel()), label(scene.tokenCount).css(numberS()), label('').css(numberS()), label(sizeString(scene.tokenImages)).css(numberS()), label('').css(numberS())),
            row().append(label('Total').css(leftLabel()), label('').css(numberS()), label('').css(numberS()), label(sizeString(scene.imgSize + scene.templateImages + scene.tileImages + scene.tokenImages)).css(numberS()), label(sizeString(scene.templateImages + scene.tileImages + scene.tokenImages + scene.totalSize)).css(numberS()).css(bolded())),
        ));

        console.log('SCENE:', ...typedSize(scene.totalSize), 'data;', ...typedSize(scene.imgSize), 'image');
        console.log('ITEMS:', items.length, 'entities;', ...typedSize(itemTotalTransfer), 'data;', ...typedSize(itemTotalImgs), 'images');
        console.log('Total:',
            actors.length + items.length, 'objects;',
            ...typedSize(totalTransfer), 'data;',
            ...typedSize(totalImages), 'images'
        );
    }

    if (sceneA) renderSceneData(sceneA, 'Active Scene');
    sceneRow.append(row().css({ width: '5px', flex: '0 0 5px', 'max-width': '5px' }));
    if (sceneV) renderSceneData(sceneV, 'Viewed Scene');
    else sceneRow.append(col());

    // Helper functions and data

    function sortBySSize(a, b) {
        return b.totalSize - a.totalSize;
    }
    actors.sort(sortBySSize);
    items.sort(sortBySSize);

    function handleFatty(d, el) {
        console.log(`> [${d.id}] ${d.name}`,
            ...typedSize(d.totalSize ?? 0), '---',
            ...typedSize(d.transferSize ?? 0), 'data',
            ...typedSize((d.imgSize ?? 0) + (d.tokenSize ?? 0)), 'image(s)');

        el.append(
            row().append(
                label(d.name).css(leftLabel()),
                label(sizeString(d.transferSize ?? 0)).css(numberS()),
                label(sizeString((d.imgSize ?? 0) + (d.tokenSize ?? 0))).css(numberS()),
                label(sizeString(d.totalSize ?? 0)).css(numberS()),
            ),
        );
    }

    /** bla */

    const itemsAndActors = row();
    html.append(itemsAndActors);

    /** ACTORS */

    const actorEl = col();
    itemsAndActors.append(actorEl.append(
        // $('<hr>'),
        row().append(h2('Actors')),
        row().css(darkBg()).append(label().css(leftLabel()), label('Count').css(numberS()), label('Data').css(numberS()), label('Images').css(numberS()), label('Total').css(numberS())),
        row().append(label('All actors').css(leftLabel()), label(actors.length).css(numberS()), label(sizeString(actorTotalTransfer)).css(numberS()), label(sizeString(actorTotalImgs)).css(numberS()), label(sizeString(actorTotalTransfer + actorTotalImgs)).css(numberS()).css(bolded())),
        row().append(h3('Fattest')),
        row().css(darkBg()).append(label('Actor').css(bolded()), label('Data').css(numberS()), label('Images').css(numberS()), label('Total').css(numberS())),
    ));

    itemsAndActors.append(row().css({ width: '5px', flex: '0 0 5px', 'max-width': '5px' }));

    console.log('Fattest Actors');
    for (const a of actors.slice(0, 5))
        handleFatty(a, actorEl);

    /** ITEMS */

    const itemEl = col();
    itemsAndActors.append(itemEl.append(
        // $('<hr>'),
        row().append(h2('Items')),
        row().css(darkBg()).append(label().css(leftLabel()), label('Count').css(numberS()), label('Data').css(numberS()), label('Images').css(numberS()), label('Total').css(numberS())),
        row().append(label('All items').css(leftLabel()), label(items.length).css(numberS()), label(sizeString(itemTotalTransfer)).css(numberS()), label(sizeString(itemTotalImgs)).css(numberS()), label(sizeString(itemTotalImgs + itemTotalTransfer)).css(numberS()).css(bolded())),
        row().append(h3('Fattest')),
        row().css(darkBg()).append(label('Item').css(bolded()), label('Data').css(numberS()), label('Image').css(numberS()), label('Total').css(numberS())),
    ));

    console.log('Fattest Items');
    for (const i of items.slice(0, 5))
        handleFatty(i, itemEl);

    /** CHAT LOG */

    const finalLine = row();
    html.append(finalLine);
    finalLine.append(col().append(
        h2('Chat Log'),
        row().css(darkBg()).append(label('').css(leftLabel()), label('Count').css(numberS()), label('Data').css(numberS()), label('Images').css(numberS()), label('Total').css(numberS())),
        row().append(label('Messages').css(leftLabel()), label(log.count).css(numberS()), label(sizeString(log.transferSize)).css(numberS()), label('?').css(numberS()), label(sizeString(log.totalSize)).css(numberS()).css(bolded())),
    ));

    /** Total */

    finalLine.append(row().css({ width: '5px', flex: '0 0 5px', 'max-width': '5px' }));

    finalLine.append(col().append(
        h2('Total'),
        row().css(darkBg()).append(label('').css(leftLabel()), label('Data').css(numberS()), label('Images').css(numberS()), label('Total').css(numberS())),
        row().append(
            label('').css(leftLabel()),
            label(sizeString(totalTransfer)).css(numberS()),
            label(sizeString(totalImages)).css(numberS()),
            label(sizeString(totalData)).css(numberS()).css(bolded())
        ),
    ));

    /** Done */

    console.log('... all done!');

    new Dialog({
        title: 'World Data',
        content: $('<div>').append(html).html(),
        buttons: {},
    }, {
        width: 780,
    }).render(true);
})();
