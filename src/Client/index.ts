import Bot from '../Telegram';
import {CreateUser, GetUserByUsername, UpdateUserDays, UpdateUserState, UpdateUserApiKey, UpdateUserApiSecret} from '../Models/User';
import {GetKey, CloseKey} from '../Models/Keys';
import {GetUserInfo} from '../Binance/Info';
const EmptySpeechs = require('../Speech/Empty.json')

Bot.on('message', async (msg)=>{
    // Check chat id on firebase
    const ID = msg.chat.id;
    let USER = await GetUserByUsername(msg.chat.username);
    const LANGUAGE = 'pt';

    if(!USER){
        // Create new user
        await CreateUser(ID, msg.chat.username);
        return await Bot.sendMessage(ID, 'Olá ' + msg.chat.username + EmptySpeechs['1'][LANGUAGE]);
    }
    
    switch (USER.state) {
        case 'FIRST_KEY_PENDING': 
            USER = await FIRST_KEY_PENDING(msg, LANGUAGE, ID, USER);
            if(typeof USER === 'boolean') return;
            await UpdateUserState(USER);
            break;
        
        case 'PENDING_API_KEY':
            USER.apiKey = msg.text.trim();
            await UpdateUserApiKey(USER);
            USER.state = "PENDING_API_SECRET";
            await UpdateUserState(USER);
            await Bot.sendMessage(ID, EmptySpeechs['7'][LANGUAGE]);
            break;
    
        case 'PENDING_API_SECRET':
            USER.apiSecret = msg.text.trim();
            await UpdateUserApiSecret(USER);
            await Bot.sendMessage(ID, EmptySpeechs['8'][LANGUAGE]);
            const info = await GetUserInfo({key: USER.apiKey, secret: USER.apiSecret});
            if(!info){
                USER.state = 'PENDING_API_KEY';
                await UpdateUserState(USER);
                await Bot.sendMessage(ID, EmptySpeechs['8.1'][LANGUAGE]);
                break;
            }
            USER.state = "COMPLETE";
            await UpdateUserState(USER);
            break;
        }
        
});

const FIRST_KEY_PENDING = async (msg, LANGUAGE, ID, USER) => {
    if(msg.text.length < 1) return Bot.sendMessage(ID, EmptySpeechs['2'][LANGUAGE]);
    // GET Key
    const key = await GetKey(msg.text.trim());
    if(!key) return Bot.sendMessage(ID, EmptySpeechs['2'][LANGUAGE]);

    if(!key.valid) return Bot.sendMessage(ID, EmptySpeechs['3'][LANGUAGE]);

    // Add Days to user and close key
    await CloseKey(msg.text.trim());
    await UpdateUserDays(USER, key.days);

    Bot.sendMessage(ID, EmptySpeechs['4'][LANGUAGE] + key.days + EmptySpeechs['4.1'][LANGUAGE]);

    if(!USER.apiKey){
        USER.state = 'PENDING_API_KEY';
    }
    else if(!USER.apiSecret){
        USER.state = 'PENDING_API_SECRET';
    }

    await Bot.sendMessage(ID, EmptySpeechs['5'][LANGUAGE]);
    await Bot.sendMessage(ID, EmptySpeechs['6'][LANGUAGE]);
    return USER;
}