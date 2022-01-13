const config = require('./lib/config');
const TeleBot = require('telebot');
const { DateTime } = require("luxon");
const lang = require("./lang/ru");
let schedule = require('node-schedule');
let jsoning = require('jsoning');

const HEROES_GRID_KEY = "heroes";
try {
const bot = new TeleBot({
    token: config.authId, // Required. Telegram Bot API token.
    polling: { // Optional. Use polling.
        interval: 5000, // Optional. How often check updates (in ms).
        timeout: 5000, // Optional. Update polling timeout (0 - short polling).
        limit: 2, // Optional. Limits the number of updates to be retrieved.
        retryTimeout: 5000, // Optional. Reconnecting timeout (in ms).
        //proxy: 'http://username:password@yourproxy.com:8080' // Optional. An HTTP proxy to be used.
    },
    // webhook: { // Optional. Use webhook instead of polling.
    //     key: 'key.pem', // Optional. Private key for server.
    //     cert: 'cert.pem', // Optional. Public key.
    //     url: 'https://....', // HTTPS url to send updates to.
    //     host: '0.0.0.0', // Webhook server host.
    //     port: 443, // Server port.
    //     maxConnections: 40 // Optional. Maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery
    // },
    // allowedUpdates: [], // Optional. List the types of updates you want your bot to receive. Specify an empty list to receive all updates.
    // usePlugins: ['askUser'], // Optional. Use user plugins from pluginFolder.
    // pluginFolder: '../plugins/', // Optional. Plugin folder location.
    // pluginConfig: { // Optional. Plugin configuration.
    //     // myPluginName: {
    //     //   data: 'my custom value'
    //     // }
    // }
});


let db = new jsoning(process.env.DB_FILE_PATH || config.dbFile);

schedule.scheduleJob('0 0 ' + config.congratTimeHour + ' * * *', () => {
    congrat();
});
bot.on(['/listbd', '/addbd', '/delbd'], (msg) => executeCommand(msg));
bot.start();

let heroModel = {
    name: "",
    date: ""
}

/**
 * Process a bot command
 * @param {str} msg 
 */
function executeCommand(msg) {
    console.log(JSON.stringify(msg));
    let text = msg.text.replace(config.apBotName, "").trim();
    let command = text.split(" ")[0];
    console.log('execute ' + command);


    switch (command) {
        case '/listbd':
            getBDList().then((list) => bot.sendMessage(msg.chat.id, list));
            break;
        case '/addbd':
            addBD(text)
                .then(
                    (addResult) => getBDList().then(
                        (list) => bot.sendMessage(msg.chat.id, addResult + list)
                    ).catch((err) => bot.sendMessage(msg.chat.id, err))
                )
                .catch((addResult) => bot.sendMessage(msg.chat.id, addResult));
            break;
        case '/delbd':
            delBD(text)
                .then((delResult) => getBDList().then(
                    (list) => bot.sendMessage(msg.chat.id, delResult + list)
                ))
                .catch((delResult) => bot.sendMessage(msg.chat.id, delResult));
            break;
    }
}

/**
 * Process a command string for adding a hero birthday
 * @param {str} command 
 * @returns command processing result
 */
const addBD = (command) => new Promise((resolve, reject) => {
    let entity = command.replace("/addbd", "").split("-");
    heroModel.name = entity[0].trim();
    if (entity.length < 2 || heroModel.name == "" || !heroModel.name.includes("@")) {
        reject(lang.wrongAddFormatMsg);
    }
    heroModel.date = entity[1].trim();
    if (heroModel.date == "" || heroModel.date.length != 5 || heroModel.date.split(".").length != 2) {
        reject(lang.wrongAddFormatMsg);
    }
    try {
        let dateForCheck = heroModel.date.split(".");
        if (!DateTime.fromObject({ year: 1970, month: dateForCheck[1], day: dateForCheck[0] }).isValid) {
            reject(lang.wrongDateMsg);
        }
        pushHero(heroModel).then((result) => resolve(result)).catch((err) => reject(err));
    } catch (error) {
        console.log(error);
    }
});

/**
 * Process a command string for getting a hero birthday list
 * @returns command processing result
 */
const getBDList = () => new Promise((resolve, reject) => {
    db.get(HEROES_GRID_KEY).then((result) => {
        console.log(JSON.stringify(result));
        let list = '';
        if (result.length > 0) {
            result.forEach(e => list = list + e.name + ' ' + e.date + '\n');
            resolve(list);
        } else {
            resolve(lang.emptyListMsg);
        }
    })
        .catch((err) => reject(err));
});

/**
 * Process a command string for deleting a hero birthday
 * @param {str} command 
 * @returns 
 */
const delBD = (command) => new Promise((resolve, reject) => {
    let entity = command.replace("/delbd", "").split("-");
    let heroName = entity[0].trim();
    console.log(heroName);
    if (heroName != "") {
        db.get(HEROES_GRID_KEY).then((heroes) => {
            if (heroes.length > 0) {
                if (heroes.some(h => h.name === heroName)) {
                    let nHeroes = heroes.filter(h => h.name.toUpperCase() !== heroName.toUpperCase());
                    db.set(HEROES_GRID_KEY, nHeroes).then(() => resolve(lang.sucNewListMsg)).catch((err) => reject(err));
                } else {
                    console.log("no such key");
                    resolve(lang.noSuchHeroMsg);
                }
            } else {
                resolve(lang.emptyListMsg);
            }
        });
    } else {
        reject(lang.wrongDelFormatMsg);
    }
});

/**
 * Push entity to the database
 * @param {Object} hero 
 * @returns pushing result
 */
const pushHero = (hero) => new Promise((resolve, reject) => {
    try {
        db.get(HEROES_GRID_KEY).then((heroes) => {
            if (heroes.length > 0) {
                if (heroes.some(h => h.name === hero.name && h.date === hero.date)) {
                    resolve(lang.addExistedItemMsg);
                } else {
                    let replacedHero = heroes.filter(h => h.name === hero.name);
                    if (replacedHero.length === 0) {
                        db.push(HEROES_GRID_KEY, hero).then(() => {
                            resolve(lang.sucNewListMsg);
                        }).catch((err) => reject(err));
                    } else {
                        replacedHero.forEach((rH) => heroes.splice(heroes.indexOf(rH), 1));
                        heroes.push(hero);
                        db.set(HEROES_GRID_KEY, heroes).then(() => {
                            resolve(lang.sucNewListMsg);
                        }).catch((err) => reject(err));
                    }
                }
            } else {
                db.push(HEROES_GRID_KEY, hero).then(() => {
                    resolve(lang.sucNewListMsg);
                }).catch((err) => reject(err));
            }
        }).catch((err) => reject(err));
    } catch (err) {
        reject(err);
    }
});

function congrat() {
    db.get(HEROES_GRID_KEY).then((heroList) => {
        if (heroList.length > 0) {
            let [day, month, year] = new Date().toLocaleDateString("ru-RU").split(".");
            // A few person can have their birhdays at the same date
            let heroList = heroList.filter(h => h.date == (day + "." + month));
            console.log(JSON.stringify(heroList));
            if (heroList.length > 0) {
                heroList.forEach(hr => bot.sendMessage(config.chatId, hr.name + lang.congratsMsg));
            }
        }
    });
}
} catch(e) {
  console.error(e);
}
