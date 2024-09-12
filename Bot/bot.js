const { Telegraf } = require('telegraf');
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Replace your token here
const TOKEN = '7296205722:AAEOzw516ZJQKnk2fMJBBR-bDThVslO8ly0';

// Firebase configuration
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://botclientmouse-default-rtdb.europe-west1.firebasedatabase.app/', // Example: https://your-project-id.firebaseio.com
});

// Creating an instance of the bot
const bot = new Telegraf(TOKEN);

const web_link = 'https://telebot-eosin.vercel.app/';
const MenuButtonType = 'web_app';
const MenuButtonText = 'Launch App';

bot.start(async (ctx) => {
  const chatId = ctx.chat.id;
  const userId = ctx.from.id.toString();
  const userName = ctx.from.first_name;
  const userUsername = ctx.from.username;

  // Fetch user data from Firebase
  const userRef = admin.database().ref('users/' + userId);
  const userSnapshot = await userRef.once('value');
  let click_score = userSnapshot.exists() ? userSnapshot.val().click_score : 0;

  // Generating the web app URL
  const webAppUserUrl = `${web_link}?userId=${userId}`;
  ctx.setChatMenuButton(Object({
	type: MenuButtonType,
	text: MenuButtonText,
	web_app: { url: webAppUserUrl }
}))
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
