import { Telegraf } from 'telegraf'

const TOKEN = '7296205722:AAEOzw516ZJQKnk2fMJBBR-bDThVslO8ly0'
const bot = new Telegraf(TOKEN)

const web_link = 'https://telebot-eosin.vercel.app/'
const MenuButtonType = 'web_app'
const MenuButtonText = '🕹️ Launch App'
bot.start(ctx =>
	ctx.reply(
		'Welcome!',
		{
			reply_markup: {
				keyboard: [[{ text: 'Web App', web_app: { url: web_link } }]],
			},
		},
		ctx.setChatMenuButton(
			Object({
				type: MenuButtonType,
				text: MenuButtonText,
				web_app: { url: web_link },
			})
		)
	)
)

bot.launch()
