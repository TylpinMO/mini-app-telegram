const { Telegraf } = require('telegraf')
const TOKEN = '7535012150:AAHjAvBOCpPMbHyumk3gtbD9D7gwTsz9egE'
const bot = new Telegraf(TOKEN)

const web_link = 'https://telebot-eosin.vercel.app/'
const MenuButtonType = 'web_app'
const MenuButtonText = '🕹️ Launch App'
bot.start(ctx =>
	ctx.reply(
		'Welcom)))))))))e',
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
