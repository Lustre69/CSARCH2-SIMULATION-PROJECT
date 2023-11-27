class CacheSimulator {
    constructor(cacheBlocks = 32, cacheLineSize = 16) {
        this.cacheBlocks = cacheBlocks;
        this.cacheLineSize = cacheLineSize;
        this.cache = new Array(cacheBlocks).fill(-1);
        this.memoryAccessCount = 0;
        this.cacheHitCount = 0;
        this.cacheMissCount = 0;
    }

    accessMemory(blockAddress) {
        this.memoryAccessCount++;
        const blockIndex = blockAddress % this.cacheBlocks;
        if (this.cache[blockIndex] === blockAddress) {
            this.cacheHitCount++;
        } else {
            this.cacheMissCount++;
            this.cache[blockIndex] = blockAddress;
        }
    }

    runTest(testType, n) {
        if (testType === 'sequential') {
            for (let i = 0; i < 4; i++) { // Repeat sequence four times
                for (let blockAddress = 0; blockAddress < 2 * n; blockAddress++) {
                    this.accessMemory(blockAddress);
                }
            }
        } else if (testType === 'random') {
            for (let i = 0; i < 4 * n; i++) {
                const blockAddress = Math.floor(Math.random() * 2 * n);
                this.accessMemory(blockAddress);
            }
        } else if (testType === 'midRepeat') {
            const sequence = [];
            for (let i = 0; i < n; i++) {
                sequence.push(i);
            }
            sequence.push(...sequence); // Repeat middle part of sequence
            for (let i = n; i < 2 * n; i++) {
                sequence.push(i);
            }

            for (let i = 0; i < 4; i++) { // Repeat full sequence four times
                sequence.forEach(blockAddress => {
                    this.accessMemory(blockAddress);
                });
            }
        }
    }

    getStatistics() {
        const hitRate = this.cacheHitCount / this.memoryAccessCount;
        const missRate = this.cacheMissCount / this.memoryAccessCount;
        return {
            memoryAccessCount: this.memoryAccessCount,
            cacheHitCount: this.cacheHitCount,
            cacheMissCount: this.cacheMissCount,
            cacheHitRate: hitRate,
            cacheMissRate: missRate
        };
    }
}

function runSimulation() {
    const testType = document.getElementById("testType").value;
    const cacheBlocks = parseInt(document.getElementById("cacheBlocks").value);
    const simulator = new CacheSimulator(cacheBlocks);
    simulator.runTest(testType, cacheBlocks);
    const statistics = simulator.getStatistics();
    displayResults(statistics);
}

function displayResults(stats) {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = `
        <p>Memory Access Count: ${stats.memoryAccessCount}</p>
        <p>Cache Hit Count: ${stats.cacheHitCount}</p>
        <p>Cache Miss Count: ${stats.cacheMissCount}</p>
        <p>Cache Hit Rate: ${stats.cacheHitRate.toFixed(2)}</p>
        <p>Cache Miss Rate: ${stats.cacheMissRate.toFixed(2)}</p>
    `;
}
``
