class CacheBlock{
    constructor(mru = null, value = -1) {
        this.mru = mru;
        this.value = value;
    }
}

class eightWayBSA{
    constructor(cacheBlocks = 32, ways = 8) {
        this.cacheBlocks = cacheBlocks;
        this.ways = ways;
        this.sets = cacheBlocks / ways;

        this.cacheHit = 0;
        this.cacheMiss = 0;
        this.memoryAccess = 0;
        this.logs = [];
        this.cache = null;
    }

    initializeCache() {
        let cacheBlock = new CacheBlock()
        return new Array(this.sets).fill(null).map(() => new Array(this.ways).fill(cacheBlock));
    }

    generateSequence(testType, n) {
        // Generate test sequence based on type: 'sequential', 'random', 'midRepeat'
        let sequence = [];
        switch (testType) {
            case 'sequential':
                sequence = Array.from({ length: 2 * n }, (_, i) => i % n);
                break;
            case 'random':
                for (let i = 0; i < 4 * n; i++) {
                    sequence.push(Math.floor(Math.random() * n));
                }
                break;
            case 'midRepeat':
                let half = Array.from({ length: n }, (_, i) => i);
                sequence = [...half, ...half, ...Array.from({ length: n }, (_, i) => i + n)];
                break;
            default:
                sequence = Array.from({ length: n }, (_, i) => i);
        }
        return sequence.flat().slice(0, 4 * n); // Ensure the sequence is 4n in length
    }

    simulate(testType, cacheBlocks){
        let sequence = this.generateSequence(testType, cacheBlocks);
        let cache = this.initializeCache();
        for(let i = 0; i < sequence.length; i++){
            this.memoryAccess++;
            let loc = sequence[i] % this.sets;
            let blocksVal = [];
            let mruVal = [];
            let hit = "";
            for(let j = 0; j < cache[loc].length; j++){
                blocksVal.push(cache[loc][j].value);
            }
            for(let j = 0; j < cache[loc].length; j++){
                mruVal.push(cache[loc][j].mru);
            }
            
            if(blocksVal.includes(sequence[i]) == false){
                if(mruVal.includes(null) == true){
                    cache[loc][mruVal.indexOf(null)] = new CacheBlock(true, sequence[i]);
                }
                else{
                    for(let j = 0; j < cache[loc].length; j++){
                        cache[loc][j].mru = false;
                    }
                    cache[loc][mruVal.indexOf(true)] = new CacheBlock(true, sequence[i]);
                }
                hit = "miss";
                this.cacheMiss++;
            }
            else{
                for(let j = 0; j < cache[loc].length; j++){
                    cache[loc][j].mru = false;
                }
                cache[loc][mruVal.indexOf(true)] = new CacheBlock(true, sequence[i]);
                hit = "hit";
                this.cacheHit++;
            }
            
            let log = "Access: " + sequence[i] + " (" + hit + ")";
            this.logs.push(log);
        }
        this.cache = cache;
    }

    displayFinalSnapshot(){
        const tableContainer = document.getElementById("output");
        const label = document.createElement("h3");
        label.innerText = "Row: Set, Column: Block";
        tableContainer.appendChild(label);
        const table = createTableFromArray(this.cache);
        tableContainer.appendChild(table);
    }

    displayLogs() {
        // Display the logs of cache accesses
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = this.logs.join('<br>');
    }

    displayStatistics() {
        // Display cache access statistics
        const statsDiv = document.getElementById('statistics');
        const hitRate = (this.cacheHit / this.memoryAccess) * 100;
        const missRate = (this.cacheMiss / this.memoryAccess) * 100;

        const memoryAccessTime = 10;
        const cacheAccesTime = 1;
        const missPenalty = 42

        let avgAccessTime = ((hitRate/100) * cacheAccesTime) + ((missRate/100) * missPenalty);
        let totalAccessTime = this.cacheHit * this.cacheBlocks * cacheAccesTime + this.cacheMiss * (cacheAccesTime + this.cacheBlocks * memoryAccessTime);

        statsDiv.innerHTML = `
            <p>Memory Access Count: ${this.memoryAccess}</p>
            <p>Cache Hit Count: ${this.cacheHit}</p>
            <p>Cache Miss Count: ${this.cacheMiss}</p>
            <p>Cache Hit Rate: ${hitRate.toFixed(2)}%</p>
            <p>Cache Miss Rate: ${missRate.toFixed(2)}%</p>
            <p>Average Access Time: ${avgAccessTime.toFixed(2)} ns (Assuming 42ns no LT miss penalty)
            <p>Total Access Time: ${totalAccessTime.toFixed(2)} ns`;
    }
}

function runSimulation() {
    // Function to start the simulation based on user input
    let tableContainer = document.getElementById("output");
    let logDiv = document.getElementById('log');
    tableContainer.innerHTML = "";
    logDiv.innerHTML = "";
    const testType = document.getElementById("testType").value;
    const cacheBlocks = parseInt(document.getElementById("cacheBlocks").value);
    const traceType = document.getElementById("traceType").value;

    let bsa = new eightWayBSA();
    bsa.simulate(testType, cacheBlocks);
    console.log(traceType);
    if(traceType == "stepByStep"){
        bsa.displayLogs();
    }
    if(traceType == "finalSnapshot"){
        bsa.displayFinalSnapshot();
    }
    bsa.displayStatistics();
}

function createTableFromArray(array) {
    const table = document.createElement('table');
    array.forEach(rowData => {
        const row = document.createElement('tr');

        rowData.forEach(cellData => {
            const cell = document.createElement('td');
            cell.textContent = cellData.value;
            row.appendChild(cell);
        });

        table.appendChild(row);
    });

    return table;
}