import { Telegraf } from 'telegraf';
import admin from 'firebase-admin';
import * as serviceAccount from '../serviceAccountKey.json'; // Adjust the path as needed

// Replace your token here
const TOKEN = '7296205722:AAEOzw516ZJQKnk2fMJBBR-bDThVslO8ly0';

// Firebase configuration
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: 'https://botclientmouse-default-rtdb.europe-west1.firebasedatabase.app/',
});

// Creating an instance of the bot
const bot = new Telegraf(TOKEN);

const web_link = 'https://telebot-eosin.vercel.app/';
const MenuButtonType = 'web_app';
const MenuButtonText = 'Launch our App';

import dotenv from 'dotenv';
dotenv.config();
import { getWallets } from '../src/ton_connect/wallets';
// import TonConnect from '@tonconnect/sdk';
// import { TonConnectStorage } from '../src/ton_connect/storage';
import { getConnector } from '../src/ton_connect/connector';
import QRCode from 'qrcode';


bot.command('connect', async (ctx) => {
  const chatId = ctx.chat.id;

  try {
    const wallets = await getWallets();
    const connector = getConnector(chatId);

    // const connector = new TonConnect({
    //   storage: new TonConnectStorage(chatId),
    //   manifestUrl: process.env.MANIFEST_URL,
    // });

    connector.onStatusChange((wallet: any) => { // Change 'any' to the correct type if available
      if (wallet) {
        ctx.reply(`${wallet.device.appName} wallet connected!`);
      }
    });

    const tonkeeper = wallets.find(wallet => wallet.appName === 'tonkeeper');
    if (!tonkeeper) {
      ctx.reply('Tonkeeper wallet not found!');
      return;
    }

    const link = connector.connect({
      bridgeUrl: tonkeeper.bridgeUrl,
      universalLink: tonkeeper.universalLink,
    });

    const image = await QRCode.toBuffer(link);
    await ctx.replyWithPhoto({ source: image });
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    ctx.reply('An error occurred while connecting to the wallet.');
  }
});

// bot.on('connect', async (msg: any) => { // Replace 'any' with a more specific type if available
//   const chatId = msg.chat.id;

//   try {
//     const wallets = await getWallets();
//     const connector = getConnector(chatId);

//     connector.onStatusChange((wallet: any) => { // Replace 'any' with a more specific type if available
//       if (wallet) {
//         bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
//       }
//     });

//     const tonkeeper = wallets.find(wallet => wallet.appName === 'tonkeeper');

//     // Ensure tonkeeper is defined before continuing
//     if (!tonkeeper) {
//       await bot.sendMessage(chatId, 'Tonkeeper wallet not found!');
//       return;
//     }

//     const link = connector.connect({
//       bridgeUrl: tonkeeper.bridgeUrl,
//       universalLink: tonkeeper.universalLink,
//     });

//     const image = await QRCode.toBuffer(link);
//     await bot.sendPhoto(chatId, image);
//   } catch (error) {
//     console.error('Error connecting to wallet:', error);
//     await bot.sendMessage(chatId, 'An error occurred while connecting to the wallet.');
//   }
// });














bot.start(async (ctx) => {
  // const chatId = ctx.chat.id;
  const userId = ctx.from.id.toString();
  // const userName = ctx.from.first_name;
  const userUsername = ctx.from.username;

  // Fetch user data from Firebase
  const userRef = admin.database().ref(`users/${userId}`);
  const userSnapshot = await userRef.once('value');
  let click_score = userSnapshot.exists() ? userSnapshot.val().click_score : 0;

  // Generating the web app URL
  const webAppUserUrl = `${web_link}?userId=${userId}`;
  
  await ctx.setChatMenuButton({
    type: MenuButtonType,
    text: MenuButtonText,
    web_app: { url: webAppUserUrl }
  });

  // Send a welcome message
  await ctx.reply(`Welcome to MickeyMouseToken, @${userUsername}! Go to: ${webAppUserUrl}`);

  // Update user's score in Firebase
  await userRef.set({ click_score });
});

// Launch the bot
bot.launch().then(() => {
  console.log('Bot is running...');
}).catch((err) => {
  console.error('Error launching the bot:', err);
});

// Handle graceful shutdown
process.once('SIGINT', () => {
  bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
});










// import dotenv from 'dotenv';
// dotenv.config();
// import { getWallets } from './ton_connect/wallets';
// import TonConnect from '@tonconnect/sdk';
// import { TonConnectStorage } from './ton_connect/storage.ts';
// import { getConnector } from './ton_connect/connector.ts';
// import QRCode from 'qrcode';

// bot.on('connect', async msg => {
// 	const chatId = msg.chat.id;
	
// 	try {
// 	  const wallets = await getWallets();
//       const connector = getConnector(chatId);

// 	//   const connector = new TonConnect({
// 	// 	storage: new TonConnectStorage(chatId),
// 	// 	manifestUrl: process.env.MANIFEST_URL,
// 	//   });
  
// 	  connector.onStatusChange(wallet => {
// 		if (wallet) {
// 		  bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
// 		}
// 	  });
  
// 	  const tonkeeper = wallets.find(wallet => wallet.appName === 'tonkeeper');
  
// 	  // Ensure tonkeeper is defined before continuing
// 	  if (!tonkeeper) {
// 		await bot.sendMessage(chatId, 'Tonkeeper wallet not found!');
// 		return;
// 	  }
  
// 	  const link = connector.connect({
// 		bridgeUrl: tonkeeper.bridgeUrl,
// 		universalLink: tonkeeper.universalLink,
// 	  });
  
// 	  const image = await QRCode.toBuffer(link);
// 	  await bot.sendPhoto(chatId, image);
// 	} catch (error) {
// 	  console.error('Error connecting to wallet:', error);
// 	  await bot.sendMessage(chatId, 'An error occurred while connecting to the wallet.');
// 	}
//   });




// bot.start(async (ctx) => {
//   const chatId = ctx.chat.id;
//   const userId = ctx.from.id.toString();
//   const userName = ctx.from.first_name;
//   const userUsername = ctx.from.username;

//   // Fetch user data from Firebase
//   const userRef = admin.database().ref('users/' + userId);
//   const userSnapshot = await userRef.once('value');
//   let click_score = userSnapshot.exists() ? userSnapshot.val().click_score : 0;

//   // Generating the web app URL
//   const webAppUserUrl = `${web_link}?userId=${userId}`;
//   ctx.setChatMenuButton(Object({
// 	type: MenuButtonType,
// 	text: MenuButtonText,
// 	web_app: { url: webAppUserUrl }
// }))
//   // Send a welcome message
//   await ctx.reply(`Welcome to MickeyMouseToken, @${userUsername}! Go to: ${webAppUserUrl}`);

//   // Update user's score in Firebase
//   await userRef.set({ click_score });
// });

// // Launch the bot
// bot.launch().then(() => {
//   console.log('Bot is running...');
// }).catch((err) => {
//   console.error('Error launching the bot:', err);
// });

// // Handle graceful shutdown
// process.once('SIGINT', () => {
//   bot.stop('SIGINT');
// });
// process.once('SIGTERM', () => {
//   bot.stop('SIGTERM');
// });
