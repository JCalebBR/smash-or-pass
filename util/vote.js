module.exports = class Vote {
    constructor(timestamp = new Date(Date.now())) {
        this.smash = 0;
        this.pass = 0;
        this.count = 0;
        this.result = "";
        this.log(`VOTE STARTED`);
    };

    addSmash() {
        this.log(`SMASH ADDED`);
        return this.smash += 1;
    }

    addPass() {
        this.log(`PASS ADDED`);
        return this.pass += 1;
    }

    reset() {
        this.smash = 0;
        this.pass = 0;
        this.count = 0;
        this.result = "";
        this.log(`VOTE RESET`);
        return `Votes reset!`;
    }

    results() {
        this.count = this.smash / (this.smash + this.pass) * 100;
        if (isFinite(this.count)) {
            this.result = "Vote ended!. Chat says ";
            if (this.count >= 50)
                this.result += "niknoc1SMASH";
            else {
                this.count = 100 - this.count;
                this.result += "niknoc1Pass";
            }
            this.log(`VOTE ENDED | ${`${this.result} ${this.count.toFixed(1)}%`} | ${this.smash} | ${this.pass}`);
            return `@niknocturnal ${this.result} with ${this.count.toFixed(1)}% of all votes`;
        }
        else {
            this.error(`VOTE ERROR | Possible division by 0`);
            return `Vote counting failed!. Possible attempt of counting when there are no votes!`;
        }
    }

    debug(message) {
        return console.debug(`${new Date(Date.now())} | DEBUG | ${message}`);
    }

    info(message) {
        return console.info(`${new Date(Date.now())} | INFO | ${message}`);
    }

    log(message) {
        return console.log(`${new Date(Date.now())} | LOG | ${message}`);
    }

    warn(message) {
        return console.warn(`${new Date(Date.now())} | WARN | ${message}`);
    }

    error(message) {
        return console.error(`${new Date(Date.now())} | ERROR | ${message}`);
    }
};