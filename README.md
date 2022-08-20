# Yes. Exactly. This is one more Telegram bot

* Bot congrats/reminds a person at his/her/its birthday in any Telegram channel
* You can manage a list of persons

# How can I use it?

## Prerequisits
1. You've registered your bot so you have Bot Auth Key and Bot Name
1. You know the Chat ID which you want to send Birthday congratulations

## How to run it?

### Get the scripts and setup required parameters
1. Clone this repo to any directory. We define it `<git cloned path>`
1. Create file `config.js` and store it in `<git cloned path>/lib`
1. Insert following lines to `config.js` and set your values
```
//Auth key which you've got. For example "111111:Xxxxxxxxxxxxxxxxxxxxxxxx"
exports.authId = 
//Bot name which you've registered. For example "@mysuper_bot"
exports.apBotName = 
//Chat id which bot will send a congratulations. For example 11111111
exports.chatId = 
//Path to any directory in your OS. For example "/home/john"
exports.dbFile = 
// What time to congrat the person. Set the number. For example 8. So bot congrats them at 8:00
exports.congratTimeHour = 
```
### How to run it in Docker?
1. Open `run-telebot.sh` and put your values to TELEBOT_AUTH_ID, TELEBOT_CHAT_ID, TELEBOT_NAME
1. Make `run-telebot.sh` script executable and run it. In Linux `chmod 744 run-telebot.sh` `./run-telebot.sh`
1. Enjoy!

### How to run it directly?
1. Install Node.js >= 12.8 and NPM
1. Install all required libraries. Run `npm install`
1. Put environment variables TELEBOT_AUTH_ID, TELEBOT_CHAT_ID, TELEBOT_NAME
1. Run `node bd-telebot.js`
1. Enjoy!

### How to deploy it to your Kubernetes cluster through GitHub actions
1. Create KUBE_CONFIG GitHub Action secret and put k8s config encoded in base64
1. Create TELEBOT_AUTH_ID, TELEBOT_CHAT_ID, TELEBOT_NAME GitHub Action secret and put your values there
1. Run github Actions
