// borrowed from M.A.

/**
 * Compendium Savings
 *
 * Displays how much data (in kB) certain documentsuse on world load currently
 *   and how much they'd use if they were in compendiums.
 *
 * Supported documents: actors, items, macros, journals, rolltables and scenes.
 *
 * By default some documents are skipped (can be configured below):
 * - player owned actors
 * - player visible macros and journals
 * - player navigable scenes (active or in navigation)
 *
 * Compatibility:
 * - Foundry v10
 */

const skipPlayerOwnedActors = true; // Skip player owned actors for putting into compendiums
const skipPlayerVisibleActors = true; // Skip actors that are visible to players
const skipPlayerUsableMacros = true; // Skip macros usable by players
const skipPlayerNavigableScenes = true; // Skip scenes that player can navigate to

const savingsType = 'both'; // 'both', 'percentage', or 'size'

// Permission level at which something is considered player usable/visible (possibly swap this to OBSERVER)
const playerUseLevel = CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED;

const isPlayerVisible = (doc) => {
    if (doc.ownership.default >= playerUseLevel) return true;
    return Object.entries(doc.ownership).some(([uid, level]) => !game.users.get(uid)?.isGM && level >= playerUseLevel);
}

const countTrueSize = (arr) => arr
    .reduce((t, doc) => t + JSON.stringify(doc.toObject()).length, 0);

const countIndexSize = (arr, { documentName } = {}) => arr.reduce((t, doc) => {
    const { _id, name } = doc.toObject();
    const indexData = { _id, name };
    switch (documentName) {
        case 'Scene': {
            const { thumb } = doc.toObject();
            Object.assign(indexData, { thumb });
            break;
        }
        case 'JournalEntry':
            // Nothing needed here
            break;
        default: {
            const { sort, type, img } = doc.toObject();
            Object.assign(indexData, { sort, type, img });
            break;
        }
    }

    if (indexData._type === undefined) delete indexData._type; // Macros/RollTables don't have this
    return t + JSON.stringify(indexData).length;
}, 0);

/**
 * @param {WorldCollection} list
 */
const makeCategory = (list, { skipPlayerOwned, skipPlayerVisible, skipPlayerNavigable } = {}) => {
    const trueList = list.filter(d => {
        if (skipPlayerOwned && d.hasPlayerOwner) return false;
        if (skipPlayerVisible && isPlayerVisible(d)) return false;
        if (skipPlayerNavigable && (d.navigation && d.ownership.default > 0 || d.active)) return false;
        return true;
    });
    const count = Array.from(trueList).length;
    const { documentName } = list;
    return {
        count,
        omitted: Array.from(list).length - count,
        unpacked: countTrueSize(trueList, { documentName }) / 1_000,
        packed: countIndexSize(trueList, { documentName }) / 1_000,
        get ratio() {
            return this.packed / this.unpacked;
        },
        get savings() {
            const getPercentage = () => (1 - this.ratio) * 100;
            const getSize = () => this.unpacked - this.packed;
            const rd = Math.roundDecimals;
            switch (savingsType[0]) {
                case 'p':
                    return `${rd(getPercentage(), 1)}%`;
                case 's':
                    return `${rd(getSize(), 1)} kB`;
                default:
                    return `${rd(getSize(), 1)} kB (${rd(getPercentage(), 1)}%)`;
            }
        }
    };
}

const templateData = {
    items: makeCategory(game.items),
    actors: makeCategory(game.actors, { skipPlayerOwned: skipPlayerOwnedActors, skipPlayerVisible: skipPlayerVisibleActors }),
    tables: makeCategory(game.tables),
    macros: makeCategory(game.macros, { skipPlayerVisible: skipPlayerUsableMacros }),
    journals: makeCategory(game.journal, { skipPlayerVisible: skipPlayerUsableMacros }),
    scenes: makeCategory(game.scenes, { skipPlayerNavigable: skipPlayerNavigableScenes }),
};

const template = `
<div style="display:grid;grid-template-columns:repeat(6, min-content);column-gap:0.5rem;row-gap:0.2rem;white-space:nowrap;">
<h3>Category</h3><h3>Count</h3><h3>Omitted</h3><h3>Unpacked</h3><h3>Packed</h3><h3>Savings</h3>
<label>Actors</label><span style='justify-self:right;'>{{actors.count}}</span><span style='justify-self:right;'>{{actors.omitted}}</span><span style='justify-self:right;'>{{numberFormat actors.unpacked decimals=2}} kB</span><span style='justify-self:right;'>{{numberFormat actors.packed decimals=2}} kB</span><span style='justify-self:right;'>{{actors.savings}}</span>
<label>Items</label><span style='justify-self:right;'>{{items.count}}</span><span style='justify-self:right;'>{{items.omitted}}</span><span style='justify-self:right;'>{{numberFormat items.unpacked decimals=2}} kB</span><span style='justify-self:right;'>{{numberFormat items.packed decimals=2}} kB</span><span style='justify-self:right;'>{{items.savings}}</span>
<label>Macros</label><span style='justify-self:right;'>{{macros.count}}</span><span style='justify-self:right;'>{{macros.omitted}}</span><span style='justify-self:right;'>{{numberFormat macros.unpacked decimals=2}} kB</span><span style='justify-self:right;'>{{numberFormat macros.packed decimals=2}} kB</span><span style='justify-self:right;'>{{macros.savings}}</span>
<label>Journals</label><span style='justify-self:right;'>{{journals.count}}</span><span style='justify-self:right;'>{{journals.omitted}}</span><span style='justify-self:right;'>{{numberFormat journals.unpacked decimals=2}} kB</span><span style='justify-self:right;'>{{numberFormat journals.packed decimals=2}} kB</span><span style='justify-self:right;'>{{journals.savings}}</span>
<label>RollTables</label><span style='justify-self:right;'>{{tables.count}}</span><span style='justify-self:right;'>{{tables.omitted}}</span><span style='justify-self:right;'>{{numberFormat tables.unpacked decimals=2}} kB</span><span style='justify-self:right;'>{{numberFormat tables.packed decimals=2}} kB</span><span style='justify-self:right;'>{{tables.savings}}</span>
<label>Scenes</label><span style='justify-self:right;'>{{scenes.count}}</span><span style='justify-self:right;'>{{scenes.omitted}}</span><span style='justify-self:right;'>{{numberFormat scenes.unpacked decimals=2}} kB</span><span style='justify-self:right;'>{{numberFormat scenes.packed decimals=2}} kB</span><span style='justify-self:right;'>{{scenes.savings}}</span>
</div>
<hr>
`;

Dialog.prompt({
    title: 'Compendium Savings',
    content: Handlebars.compile(template)(templateData, { allowProtoMethodsByDefault: true, allowProtoPropertiesByDefault: true }),
    rejectClose: false,
    options: {
        width: 'auto',
        height: 'auto',
        jQuery: false
    }
});
