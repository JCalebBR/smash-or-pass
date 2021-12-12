const { CronJob } = require("cron");
const path = require("path");

require('dotenv').config();

const tmi = require('tmi.js');

const client = new tmi.Client({
    options: { debug: true, messagesLogLevel: "info" },
    connection: {
        reconnect: true,
        secure: true
    },

    identity: {
        username: `${process.env.TWITCH_USERNAME}`,
        password: `oauth:${process.env.TWITCH_OAUTH}`
    },
    channels: [`${process.env.TWITCH_CHANNEL}`]
});

const eventsDirPath = path.resolve(__dirname, "./events");
const commandsDirPath = path.resolve(__dirname, "./commands");

client.connect().catch(console.error);

let smash = 0;
let pass = 0;
let results = 0;
let win;
client.on('message', (channel, tags, message, self) => {
    // Lack of this statement or it's inverse (!self) will make it in active
    if (self) return;

    if (message.toLowerCase().includes("smash") || message.toLowerCase().includes("niknoc1smash")) {
        smash += 1;
        console.log("smash!");
    }
    if (message.toLowerCase().includes("pass") || message.toLowerCase().includes("niknoc1pass")) {
        pass += 1;
        console.log("pass!");
    }

    if (message.toLowerCase() === "!results") {
        results = smash / (smash + pass) * 100;
        win = "Chat says ";
        if (results > 50) {
            win += "niknoc1SMASH";
        } else {
            results = 100 - results;
            win += "niknoc1Pass";
        }

        client.say(channel, `@niknocturnal ${win} with ${results.toFixed(1)}% of all votes`);
    }
    if (message.toLowerCase() === "!clear") {
        smash = 0;
        pass = 0;
        client.say(channel, `@niknocturnal votes cleared!`);
        console.log("clear!");
    }
    if (message.toLowerCase() === "!ping") {
        client.say(channel, `pong!`);
        console.log(`${message}`);
    }
});