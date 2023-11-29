class CacheSimulator {
    constructor(cacheBlocks = 32, ways = 8) {
        // Initialize cache parameters
        this.cacheBlocks = cacheBlocks;
        this.ways = ways;
        this.sets = cacheBlocks / ways;
        this.cache = this.initializeCache();
        this.mru = this.initializeMRU();

        // Initialize statistics counters
        this.memoryAccessCount = 0;
        this.cacheHitCount = 0;
        this.cacheMissCount = 0;
        this.logs = [];
    }

    initializeCache() {
        return new Array(this.sets).fill(null).map(() => new Array(this.ways).fill(null));
    }

    initializeMRU() {
        return new Array(this.sets).fill(null).map(() => new Array(this.ways).fill(0));
    }

    accessMemory(blockAddress) {
        // Increment memory access count
        this.memoryAccessCount++;
        const setIndex = blockAddress % this.sets;
        const wayIndex = this.cache[setIndex].indexOf(blockAddress);

        if (wayIndex !== -1) {
            // Cache hit
            this.cacheHitCount++;
            this.updateMRU(setIndex, wayIndex, true);
            this.logs.push(`Access: ${blockAddress} (Hit)`);
        } else {
            // Cache miss
            this.cacheMissCount++;
            const replaceIndex = this.mru[setIndex].indexOf(Math.min(...this.mru[setIndex]));
            this.cache[setIndex][replaceIndex] = blockAddress;
            this.updateMRU(setIndex, replaceIndex, false);
            this.logs.push(`Access: ${blockAddress} (Miss)`);
        }
    }

    updateMRU(setIndex, wayIndex, isHit) {
        // Update MRU tracking based on hit or miss
        if (isHit) {
            this.mru[setIndex][wayIndex]++;
        } else {
            this.mru[setIndex] = this.mru[setIndex].map((val, idx) => (idx === wayIndex ? 1 : val + 1));
        }
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

    runTest(testType, n, traceType) {
        this.resetCache();
        const sequence = this.generateSequence(testType, n);
        sequence.forEach((blockAddress, index) => {
            this.accessMemory(blockAddress);
            if (traceType === 'stepByStep') {
                this.displayCurrentState(index + 1);
            }
        });
        if (traceType === 'finalSnapshot') {
            this.displayCurrentState(sequence.length);
        }
        this.displayLogs();
        this.displayStatistics();
    }

    resetCache() {
        // Reset cache, MRU, and logs for a new test run
        this.cache = this.initializeCache();
        this.mru = this.initializeMRU();
        this.memoryAccessCount = 0;
        this.cacheHitCount = 0;
        this.cacheMissCount = 0;
        this.logs = [];
    }

    displayCurrentState(step) {
        // Update the HTML with the current state of the cache
        const outputDiv = document.getElementById('output');
        let outputHtml = `<h3>Step ${step}</h3>`;
        this.cache.forEach((set, setIndex) => {
            outputHtml += `<div>Set ${setIndex}: [${set.join(', ')}]</div>`;
        });
        outputDiv.innerHTML = outputHtml;
    }

    displayLogs() {
        // Display the logs of cache accesses
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = this.logs.join('<br>');
    }

    displayStatistics() {
        // Display cache access statistics
        const statsDiv = document.getElementById('statistics');
        const hitRate = (this.cacheHitCount / this.memoryAccessCount) * 100;
        const missRate = (this.cacheMissCount / this.memoryAccessCount) * 100;
        statsDiv.innerHTML = `
            <p>Memory Access Count: ${this.memoryAccessCount}</p>
            <p>Cache Hit Count: ${this.cacheHitCount}</p>
            <p>Cache Miss Count: ${this.cacheMissCount}</p>
            <p>Cache Hit Rate: ${hitRate.toFixed(2)}%</p>
            <p>Cache Miss Rate: ${missRate.toFixed(2)}%</p>`;
    }
}

function runSimulation() {
    // Function to start the simulation based on user input
    const testType = document.getElementById("testType").value;
    const cacheBlocks = parseInt(document.getElementById("cacheBlocks").value);
    const traceType = document.getElementById("traceType").value;
    const simulator = new CacheSimulator(cacheBlocks);
    simulator.runTest(testType, cacheBlocks, traceType);
}
