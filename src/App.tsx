import { useEffect, useState } from 'react'
import './index.css'
import Arrow from './icons/Arrow'
import { bear, coin, highVoltage, notcoin, rocket, trophy } from './images'

import { initializeApp } from 'firebase/app'
import {
	getDatabase,
	ref,
	set,
	get,
	DatabaseReference,
} from 'firebase/database'

const firebaseConfig = {
	apiKey: 'AIzaSyDk-lykAi48oL0k6tpErToxMcc60_Y1RxQ',
	authDomain: 'botclientmouse.firebaseapp.com',
	databaseURL:
		'https://botclientmouse-default-rtdb.europe-west1.firebasedatabase.app',
	projectId: 'botclientmouse',
	storageBucket: 'botclientmouse.appspot.com',
	messagingSenderId: '5680704965',
	appId: '1:5680704965:web:afbe05ccb202656a652fac',
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

const App = () => {
	const urlParams = new URLSearchParams(window.location.search)
	const userId = urlParams.get('userId')
	console.log('Полученный userID:', userId)

	const dbRefToPoints = ref(database, `users/` + userId + `/click_score`)
	const dbRefToEnergy = ref(database, `users/` + userId + `/energy_val`)

	const [points, setPoints] = useState(0)
	const [energy, setEnergy] = useState(500)
	const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>(
		[]
	)
	useEffect(() => {
		const getStartPointsNum = async (dbRefToPoints: DatabaseReference) => {
			try {
				const snapshot = await get(dbRefToPoints)
				if (snapshot.exists()) {
					console.log('Данные:', snapshot.val())
					setPoints(snapshot.val()) // Устанавливаем значение в состояние
				} else {
					console.log('Нет данных')
				}
			} catch (error) {
				console.error('Ошибка при получении данных:', error)
			}
		}

		getStartPointsNum(dbRefToPoints)
	}, [dbRefToPoints])

	useEffect(() => {
		const getStartEnergyNum = async (dbRefToEnergy: DatabaseReference) => {
			try {
				const snapshot = await get(dbRefToEnergy)
				if (snapshot.exists()) {
					console.log('Данные:', snapshot.val())
					setEnergy(snapshot.val()) // Устанавливаем значение в состояние
				} else {
					console.log('Нет данных')
				}
			} catch (error) {
				console.error('Ошибка при получении данных:', error)
			}
		}

		getStartEnergyNum(dbRefToEnergy)
	}, [dbRefToEnergy])

	const pointsToAdd = 1
	const energyToReduce = 1

	const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (energy - energyToReduce < 0) {
			return
		}
		const rect = e.currentTarget.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top

		set(dbRefToPoints, points + pointsToAdd)
		set(
			dbRefToEnergy,
			energy - energyToReduce < 0 ? 0 : energy - energyToReduce
		)

		setPoints(points + pointsToAdd)
		setEnergy(energy - energyToReduce < 0 ? 0 : energy - energyToReduce)
		setClicks([...clicks, { id: Date.now(), x, y }])
	}

	const handleAnimationEnd = (id: number) => {
		setClicks(prevClicks => prevClicks.filter(click => click.id !== id))
	}

	// useEffect hook to restore energy over time
	useEffect(() => {
		const interval = setInterval(async () => {
			setEnergy(prevEnergy => {
				const newEnergy = Math.min(prevEnergy + 1, 500)
				// Set new energy to Firebase
				set(dbRefToEnergy, newEnergy).catch(error =>
					console.error('Ошибка при обновлении энергии:', error)
				)
				return newEnergy
			})
		}, 3000) // Restore 10 energy points every second

		return () => clearInterval(interval) // Clear interval on component unmount
	}, [])

	return (
		<div className='bg-gradient-main min-h-screen px-4 flex flex-col items-center text-white font-medium'>
			<div className='absolute inset-0 h-1/2 bg-gradient-overlay z-0'></div>
			<div className='absolute inset-0 flex items-center justify-center z-0'>
				<div className='radial-gradient-overlay'></div>
			</div>

			<div className='w-full z-10 min-h-screen flex flex-col items-center text-white'>
				<div className='fixed top-0 left-0 w-full px-4 pt-8 z-10 flex flex-col items-center text-white'>
					<div className='w-full cursor-pointer'></div>
					<div className='mt-12 text-5xl font-bold flex items-center'>
						<img src={coin} width={44} height={44} />
						<span className='ml-2'>{points.toLocaleString()}</span>
					</div>
					<div className='text-base mt-2 flex items-center'>
						<img src={trophy} width={24} height={24} />
						<span className='ml-1'>
							Bronze <Arrow size={18} className='ml-0 mb-1 inline-block' />
						</span>
					</div>
				</div>

				<div className='fixed bottom-0 left-0 w-full px-4 pb-4 z-10'>
					<div className='w-full flex justify-between gap-2'>
						<div className='w-1/3 flex items-center justify-start max-w-32'>
							<div className='flex items-center justify-center'>
								<img
									src={highVoltage}
									width={44}
									height={44}
									alt='High Voltage'
								/>
								<div className='ml-2 text-left'>
									<span className='text-white text-2xl font-bold block'>
										{energy}
									</span>
									<span className='text-white text-large opacity-75'>
										/ 500
									</span>
								</div>
							</div>
						</div>
						<div className='flex-grow flex items-center max-w-60 text-sm'>
							<div className='w-full bg-[#fad258] py-4 rounded-2xl flex justify-around'>
								<a href='http://b99640gz.beget.tech/'>
									<button className='flex flex-col items-center gap-1'>
										<img src={bear} width={24} height={24} alt='High Voltage' />
										<span>Games</span>
									</button>
								</a>
								<div className='h-[48px] w-[2px] bg-[#fddb6d]'></div>
								<button className='flex flex-col items-center gap-1'>
									<img src={rocket} width={24} height={24} alt='High Voltage' />
									<span>Soon</span>
								</button>
								<div className='h-[48px] w-[2px] bg-[#fddb6d]'></div>
								<a href='http://google.com'>
									<button className='flex flex-col items-center gap-1'>
										{/* <center>	 */}
										<img src={coin} width={24} height={24} alt='High Voltage' />
										<span>Wallet</span>
										{/* </center> */}
									</button>
								</a>
							</div>
						</div>
					</div>
					<div className='w-full bg-[#f9c035] rounded-full mt-4'>
						<div
							className='bg-gradient-to-r from-[#f3c45a] to-[#fffad0] h-4 rounded-full'
							style={{ width: `${(energy / 500) * 100}%` }}
						></div>
					</div>
				</div>

				<div className='flex-grow flex items-center justify-center'>
					<div className='relative mt-4' onClick={handleClick}>
						<img src={notcoin} width={256} height={256} alt='notcoin' />
						{clicks.map(click => (
							<div
								key={click.id}
								className='absolute text-5xl font-bold opacity-0'
								style={{
									top: `${click.y - 42}px`,
									left: `${click.x - 28}px`,
									animation: `float 1s ease-out`,
								}}
								onAnimationEnd={() => handleAnimationEnd(click.id)}
							>
								1
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default App
