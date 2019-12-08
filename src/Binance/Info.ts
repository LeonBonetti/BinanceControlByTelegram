import Binance from 'binance-api-node';

export const GetUserInfo = async (credentials: { key: string, secret: string }) => {
    const client = Binance({
        apiKey: credentials.key,
        apiSecret: credentials.secret,
    });
    
    try {
        return await client.accountInfo();
    } catch (error) {
        return false;
    }
}