// bot.launch()
const TelegramBot = require('node-telegram-bot-api')
const admin = require('firebase-admin')

// Замените ваш токен
const TOKEN = '7296205722:AAEOzw516ZJQKnk2fMJBBR-bDThVslO8ly0'

// Настройка Firebase
admin.initializeApp({
	credential: admin.credential.cert(require('../serviceAccountKey.json')),
	databaseURL:
		'https://botclientmouse-default-rtdb.europe-west1.firebasedatabase.app/', // Например: https://your-project-id.firebaseio.com
})

// Создание экземпляра бота
const bot = new TelegramBot(TOKEN, { polling: true })

const web_link = 'https://telebot-eosin.vercel.app/'
const MenuButtonType = 'web_app'
const MenuButtonText = 'Launch App'

// Обработка команды /start
bot.onText(/\/start/, async msg => {
	const chatId = msg.chat.id
	// bot.setChatMenuButton (Object({
	//         type: MenuButtonType,
	//         text: MenuButtonText,
	//         web_app: { url: web_link }
	// }))
	console.log(chatId)
	const userId = msg.from.id.toString()
	const userName = msg.from.first_name
	const userUsername = msg.from.username

	// Получение данных пользователя из Firebase
	const userRef = admin.database().ref('users/' + userId)
	const userSnapshot = await userRef.once('value')
	let click_score = userSnapshot.exists() ? userSnapshot.val().click_score : 0

	bot.sendMessage(
		chatId,
		`Welcome to MickeyMouseToken, @${userUsername} ! Click Launch app to start`,
		{}
	)
	// Обновление счета пользователя в Firebase
	await userRef.set({ click_score })
})
