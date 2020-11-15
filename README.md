# This is one more Telegram bot

* Bot congrats chat members at they birthday
* You can manage a list of chat members

## How to run in container
1. Clone this repo to any directory. We define it `<git cloned path>`
1. Create file `config.js` and store it in `<git cloned path>`
1. Insert following lines to `config.js` and set your values
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
1. Change mode for `run-telebot.sh` file to be able to execute it. In Linux run `chmod 764 run-telebot.sh`
1. Run `run-telebot.sh`. In Linux `./run-telebot.sh`
1. Enjoy!

## How to run directly (Linux)
1. Install Node.js >= 12.8 and NPM
1. Clone this repo to any directory. We define it `<git cloned path>`
1. Create file `config.js` and store it in `<git cloned path>`
1. Insert following lines to `config.js` and set your values
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
1. Install all required libraries. Run `npm install`
1. Run `node bd-telebot.js`