# This is one more Telegram bot

* Bot congrats chat members at they birthday
* You can manage a list of chat members

## How to run in container
1. Clone this repo to any directory. We define it `<git cloned path>`
1. Create file `config.js` and store it in the same directory as `commandParser.js`
1. Insert folllowing lines to `config.js` and set your values
```
(follow official Telegram Bot documentation)
//Auth key which you've got. For example "111111:Xxxxxxxxxxxxxxxxxxxxxxxx"
exports.authId = 
//Bot name which you've registered. For example "@mysuper_bot"
exports.apBotName = 
//Chat id which bot will send a congratulations. For example 11111111
exports.chatId = 
//Path to any directory in your OS. For example "/home/john"
exports.dbFile = 
// What time to congrat the person. Set the number. For example 8. So bot congrats them at 8:00
exports.config.congratTimeHour = 
```
1. Don't forget to rename `<git cloned path>` in following
`docker run -it --name bd_telebot -v /home/<git cloned path>:/tmp --restart always -e DB_FILE_PATH="/tmp/database.json" node:13.13.0-alpine3.11 node /tmp/commandParser.js`

## How to run directly (Linux)
1. Install Node.js >= 12.8 and NPM
1. Install all required libraries
`npm install`
1. Run command parser directly
`node commandParser.js`
1. Add the executing of scheduled-sender.js to cron
`cron -e`
`0 0 0 * * node scheduled-sender.js`