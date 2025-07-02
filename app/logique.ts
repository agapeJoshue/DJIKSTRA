export interface InitData {
    debut: string
    fin: string
    delais: number
}

export interface newData {
    debut: string
    fin: string
    delais: number
    isCritics: boolean
}

export interface colsUsed {
    indexLine: number
    indexCol: number
    debut: string
    distance: number
}

export interface TableCell {
    value: string;
    min: boolean;
    max: boolean;
    from: string;
    already_used: boolean;
    isCritics: boolean
}

export const INIT_DATA = [
    { debut: 'A', fin: 'B', delais: 2 },
    { debut: 'A', fin: 'C', delais: 1 },
    { debut: 'A', fin: 'D', delais: 4 },
    { debut: 'B', fin: 'E', delais: 1 },
    { debut: 'B', fin: 'D', delais: 3 },
    { debut: 'B', fin: 'C', delais: 2 },
    { debut: 'C', fin: 'E', delais: 4 },
    { debut: 'C', fin: 'F', delais: 5 },
    { debut: 'D', fin: 'C', delais: 3 },
    { debut: 'D', fin: 'E', delais: 3 },
    { debut: 'F', fin: 'D', delais: 1 },
    { debut: 'E', fin: 'G', delais: 5 },
    { debut: 'E', fin: 'F', delais: 6 },
    { debut: 'F', fin: 'G', delais: 2 }
]

function reformulerDonnees(data: InitData[]) {
    const order = new Set();

    data.forEach(item => {
        order.add(item.debut);
        order.add(item.fin);
    });

    const sortedOrder = Array.from(order).sort();

    return data.map(item => {
        const debutIndex = sortedOrder.indexOf(item.debut);
        const finIndex = sortedOrder.indexOf(item.fin);

        if (debutIndex > finIndex) {
            return { debut: item.fin, fin: item.debut, delais: item.delais };
        }
        return item;
    });
}

export const updateEntity = (data: InitData[]) => {
    const ArrayString: string[] = []
    const reformulatedData = reformulerDonnees(data);
    if (reformulatedData.some(d => d.fin === 'A')) {
        ArrayString.push('A')
    }
    const newData = reformulatedData.map(dat => {
        if (!ArrayString.includes(dat.debut)) { ArrayString.push(dat.debut) }
        if (!ArrayString.includes(dat.fin)) { ArrayString.push(dat.fin) }
        return {
            ...dat, isCritics: false
        }
    });

    return { newData, ArrayString }
}

function verify_cols(table: TableCell[][], index_col: number, entities: string[]) {
    let hasMin = false;
    for (let i = 0; i < entities.length; i++) {
        if (table[i][index_col].min && table[i][index_col].already_used) {
            hasMin = true
        }
    }
    return hasMin
}

function findMinTable(table: TableCell[][], entities: string[]) {
    let LastMinValue = Number.MAX_SAFE_INTEGER
    let LastIndexLine = 0
    let LastIndexColumn = 0
    let LastTacheMin = '';

    for (let i = entities.length - 1; i >= 0; i--) {
        const line = table[i]
        for (let j = line.length - 1; j >= 0; j--) {
            const cell = line[j];
            const hasMin = verify_cols(table, j, entities);
            if (!hasMin) {
                if (cell.value !== '' && cell.value !== '-' && cell.value !== '∞' && parseInt(cell.value) < LastMinValue) {
                    LastIndexLine = i;
                    LastIndexColumn = j;
                    LastMinValue = parseInt(cell.value);
                    LastTacheMin = entities[LastIndexColumn];
                }
            }
        }
    }
    return { LastMinValue, LastIndexLine, LastIndexColumn, LastTacheMin }
}

function FindMin(table: TableCell[][], entities: string[]) {
    const { LastIndexLine, LastIndexColumn } = findMinTable(table, entities);
    table[LastIndexLine][LastIndexColumn].min = true;
    for (let i = 0; i < entities.length; i++) {
        if (table[i] && table[i][LastIndexColumn].value === '') {
            table[i][LastIndexColumn] = { value: '-', min: false, max: false, from: '', already_used: false, isCritics: false }
        }
    }
}

export const complete_table = (table: TableCell[][], data: newData[], step: number, entities: string[]) => {
    const lineTable = table[step];
    if (step === 0) {
        lineTable[step] = { value: '0', min: true, max: false, from: '', already_used: false, isCritics: false }
        for (let i = 1; i < lineTable.length; i++) {
            lineTable[i] = { value: '∞', min: false, max: false, from: '', already_used: false, isCritics: false };
            table[i][step] = { value: '-', min: false, max: false, from: '', already_used: false, isCritics: false }
        }
    } else {
        const { LastMinValue, LastIndexLine, LastIndexColumn, LastTacheMin } = findMinTable(table, entities)
        for (let i = 0; i < lineTable.length; i++) {
            const colTable = lineTable[i];
            if (colTable.value === '') {
                const tache = data.filter(t => (t.debut === LastTacheMin && t.fin === entities[i]) || (t.fin === LastTacheMin && t.debut === entities[i]));
                if (tache.length > 0) {
                    lineTable[i] = { value: (LastMinValue + tache[0].delais).toString(), min: false, max: false, from: LastTacheMin, already_used: false, isCritics: false }
                } else {
                    colTable.value = '∞';
                }
            }
        }
        table[LastIndexLine][LastIndexColumn].already_used = true
        FindMin(table, entities)
    }
}


function verify_cols_max(table: TableCell[][], index_col: number, entities: string[]) {
    let hasMax = false;
    for (let i = 0; i < entities.length; i++) {
        if (table[i][index_col].max && table[i][index_col].already_used) {
            hasMax = true;
        }
    }
    return hasMax;
}

function findMaxTable(table: TableCell[][], entities: string[]) {
    let LastMaxValue = Number.MIN_SAFE_INTEGER;
    let LastIndexLine = 0;
    let LastIndexColumn = 0;
    let LastTacheMax = '';

    for (let i = entities.length - 1; i >= 0; i--) {
        const line = table[i];
        for (let j = line.length - 1; j >= 0; j--) {
            const cell = line[j];
            const hasMaxInCol = verify_cols_max(table, j, entities);
            if (!hasMaxInCol) {
                if (cell.value !== '' && cell.value !== '-' && cell.value !== '∞' && parseInt(cell.value) > LastMaxValue) {
                    LastIndexLine = i;
                    LastIndexColumn = j;
                    LastMaxValue = parseInt(cell.value);
                    LastTacheMax = entities[LastIndexColumn];
                }
            }
        }
    }
    return { LastMaxValue, LastIndexLine, LastIndexColumn, LastTacheMax };
}

function FindMax(table: TableCell[][], entities: string[]) {
    const { LastIndexLine, LastIndexColumn } = findMaxTable(table, entities);
    table[LastIndexLine][LastIndexColumn].max = true;
    for (let i = 0; i < entities.length; i++) {
        if (table[i] && table[i][LastIndexColumn].value === '') {
            table[i][LastIndexColumn] = { value: '-', min: false, from: '', already_used: false, isCritics: false, max: false };
        }
    }
}

export const complete_table2 = (table: TableCell[][], data: newData[], step: number, entities: string[]) => {
    const lineTable = table[step];
    if (step === 0) {
        lineTable[step] = { value: '0', min: false, from: '', already_used: false, isCritics: false, max: true };
        for (let i = 1; i < lineTable.length; i++) {
            lineTable[i] = { value: '∞', min: false, from: '', already_used: false, isCritics: false, max: false };
            table[i][step] = { value: '-', min: false, from: '', already_used: false, isCritics: false, max: false };
        }
    } else {
        const { LastMaxValue, LastIndexLine, LastIndexColumn, LastTacheMax } = findMaxTable(table, entities);
        for (let i = 0; i < lineTable.length; i++) {
            const colTable = lineTable[i];
            if (colTable.value === '') {
                const tache = data.filter(t => (t.debut === LastTacheMax && t.fin === entities[i]) || (t.fin === LastTacheMax && t.debut === entities[i]));
                if (tache.length > 0) {
                    lineTable[i] = { value: (LastMaxValue + tache[0].delais).toString(), min: false, from: LastTacheMax, already_used: false, isCritics: false, max: false };
                } else {
                    colTable.value = '∞';
                }
            }
        }
        table[LastIndexLine][LastIndexColumn].already_used = true;
        FindMax(table, entities);
    }
};

interface refact_tache { indexLine: number, indexCol: number, tache: TableCell }

function findTacheHasSameFromValue(table: TableCell[][], tache: refact_tache, step: number) {
    let lists_tache: refact_tache = tache;

    for (let i = step - 1; i >= 0; i--) {
        for (let j = 1; j < step; j++) {
            const cell = table[i][step - j];
            if (cell.min && cell.from === tache.tache.from && parseInt(cell.value) < parseInt(tache.tache.value)) {
                lists_tache = {
                    indexLine: i,
                    indexCol: step - j,
                    tache: cell
                }
            }
        }
    }

    return lists_tache
}

export const find_critics_path = (table: TableCell[][], step: number, entities: string[]) => {
    let nextStep = entities.length;
    const last_entity = entities[step];
    const indexOfEntity = entities.indexOf(last_entity);

    for (let i = 0; i < entities.length; i++) {
        const cell = table[i][indexOfEntity];
        if (cell.min) {
            const cellRefact = { indexLine: i, indexCol: step, tache: cell }
            const lists_tache = findTacheHasSameFromValue(table, cellRefact, step)
            table[lists_tache.indexLine][lists_tache.indexCol].isCritics = true;
            nextStep = entities.indexOf(lists_tache.tache.from)
        }
    }

    return { table, nextStep, critic: last_entity }
}

function findTacheHasSameFromValueMax(table: TableCell[][], tache: refact_tache, step: number): refact_tache {
    let lists_tache: refact_tache = tache;

    for (let i = step - 1; i >= 0; i--) { 
        for (let j = 1; j < step; j++) {
            const colIndex = step - j;
            if (colIndex >= 0 && table[i] && table[i][colIndex]) {
                const cell = table[i][colIndex];

                if (cell.max && cell.from === tache.tache.from && cell.value !== '' && cell.value !== '-' && cell.value !== '∞' && parseInt(cell.value) > parseInt(lists_tache.tache.value)) {
                    lists_tache = {
                        indexLine: i,
                        indexCol: colIndex,
                        tache: cell
                    };
                }
            }
        }
    }
    return lists_tache;
}

export const find_critics_path_max = (table: TableCell[][], step: number, entities: string[]) => {
    let nextStep = entities.length;
    const current_entity = entities[step];
    const indexOfEntity = entities.indexOf(current_entity);

    for (let i = 0; i < entities.length; i++) {
        if (table[i] && table[i][indexOfEntity]) {
            const cell = table[i][indexOfEntity];

            if (cell.max) {
                const cellRefact = { indexLine: i, indexCol: indexOfEntity, tache: cell };

                const lists_tache = findTacheHasSameFromValueMax(table, cellRefact, step);

                table[lists_tache.indexLine][lists_tache.indexCol].isCritics = true;

                nextStep = entities.indexOf(lists_tache.tache.from);
            }
        }
    }

    return { table, nextStep, critic: current_entity };
};