class CacheSimulator {
    constructor(cacheBlocks = 32, ways = 8) {
        this.cacheBlocks = cacheBlocks;
        this.ways = ways;
        this.sets = cacheBlocks / ways;
        this.cache = this.initializeCache();
        this.mru = this.initializeMRU();
        this.logs = [];
    }

    initializeCache() {
        return new Array(this.sets).fill(null).map(() => new Array(this.ways).fill(null));
    }

    initializeMRU() {
        return new Array(this.sets).fill(null).map(() => new Array(this.ways).fill(0));
    }

    accessMemory(blockAddress) {
        const setIndex = blockAddress % this.sets;
        const wayIndex = this.cache[setIndex].indexOf(blockAddress);

        if (wayIndex !== -1) { // Cache hit
            this.updateMRU(setIndex, wayIndex, true);
            this.logs.push(`Access: ${blockAddress} (Hit)`);
        } else { // Cache miss
            const replaceIndex = this.mru[setIndex].indexOf(Math.min(...this.mru[setIndex]));
            this.cache[setIndex][replaceIndex] = blockAddress;
            this.updateMRU(setIndex, replaceIndex, false);
            this.logs.push(`Access: ${blockAddress} (Miss)`);
        }
    }

    updateMRU(setIndex, wayIndex, isHit) {
        if (isHit) {
            this.mru[setIndex][wayIndex]++;
        } else {
            this.mru[setIndex] = this.mru[setIndex].map((val, idx) => (idx === wayIndex ? 1 : val + 1));
        }
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
    }

    resetCache() {
        this.cache = this.initializeCache();
        this.mru = this.initializeMRU();
        this.logs = [];
    }

    generateSequence(testType, n) {
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

    displayCurrentState(step) {
		const outputDiv = document.getElementById('output');
		let outputHtml = `<h3>Step ${step}</h3>`;
		this.cache.forEach((set, setIndex) => {
			outputHtml += `<div>Set ${setIndex}: [${set.join(', ')}]</div>`;
		});
    outputDiv.innerHTML = outputHtml;
}

    displayLogs() {
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = this.logs.join('<br>');
    }
}

function runSimulation() {
    const testType = document.getElementById("testType").value;
    const cacheBlocks = parseInt(document.getElementById("cacheBlocks").value);
    const traceType = document.getElementById("traceType").value;
    const simulator = new CacheSimulator(cacheBlocks);
    simulator.runTest(testType, cacheBlocks, traceType);
}
