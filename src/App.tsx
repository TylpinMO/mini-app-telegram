import { useEffect, useState } from 'react'
import './index.css'
import Arrow from './icons/Arrow'
import { bear, coin, highVoltage, notcoin, rocket, trophy } from './images'

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get} from "firebase/database"; // Для Realtime Database

// Ваши данные конфигурации
const firebaseConfig = {
	apiKey: "AIzaSyDk-lykAi48oL0k6tpErToxMcc60_Y1RxQ",
	authDomain: "botclientmouse.firebaseapp.com",
	databaseURL: "https://botclientmouse-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "botclientmouse",
	storageBucket: "botclientmouse.appspot.com",
	messagingSenderId: "5680704965",
	appId: "1:5680704965:web:afbe05ccb202656a652fac"
  };

// Инициализация приложения Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Для Realtime Database



// const admin = require('firebase-admin')
// import admin from 'firebase-admin'

// admin.initializeApp({
// 	credential: admin.credential.cert(require('../serviceAccountKey.json')),
// 	databaseURL:
// 		'https://botclientmouse-default-rtdb.europe-west1.firebasedatabase.app/', // Например: https://your-project-id.firebaseio.com
// })
// const database = admin.database();

const App = () => {
	const urlParams = new URLSearchParams(window.location.search);
	const userId = urlParams.get('userId');
	console.log('Полученный userID:', userId);
	
	const dbRef = ref(database, `users/` + userId +`/click_score`);
	var start_user_points_score = 0
	get (dbRef)
    .then((snapshot) => {
        if (snapshot.exists()) {
            console.log("Данные:", snapshot.val());
			start_user_points_score =  snapshot.val()
            console.log("Данные:", start_user_points_score);
        } else {
            console.log("Нет данных");
        }
    })
    .catch((error) => {
        console.error("Ошибка при получении данных:", error);
    });


	var [points, setPoints] = useState(start_user_points_score)
	const [energy, setEnergy] = useState(500)
	const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>(
		[]
	)
	const pointsToAdd = 1
	const energyToReduce = 1

	const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (energy - energyToReduce < 0) {
			return
		}
		const rect = e.currentTarget.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top
		

		set (dbRef, points + pointsToAdd);
		// update(dbRef, points + pointsToAdd)
		// 	.then(() => {
		// 		console.log("Данные успешно обновлены!");
		// 	})
		// 	.catch((error) => {
		// 		console.error("Ошибка обновления данных: ", error);
		// 	});
		
		// Пример вызова функции
		// updateFieldInRealtimeDB("users/userID123/age", 30);
		
		// const urlParams = new URLSearchParams(window.location.search);
		// const userId = urlParams.get('userId');
		// const userRef = admin.database().ref('users/' + userId)
		// const userSnapshot = await userRef.once('value')
		// let click_score = userSnapshot.exists() ? userSnapshot.val().click_score + pointsToAdd : 0
		// // Обновление счета пользователя в Firebase
		// await userRef.set({ click_score })
		
		
		setPoints(points + pointsToAdd)
		setEnergy(energy - energyToReduce < 0 ? 0 : energy - energyToReduce)
		setClicks([...clicks, { id: Date.now(), x, y }])
	}

	const handleAnimationEnd = (id: number) => {
		setClicks(prevClicks => prevClicks.filter(click => click.id !== id))
	}

	// useEffect hook to restore energy over time
	useEffect(() => {
		const interval = setInterval(() => {
			setEnergy(prevEnergy => Math.min(prevEnergy + 1, 500))
		}, 3000) // Restore 10 energy points every second

		return () => clearInterval(interval) // Clear interval on component unmount
	}, [])

	// const saveData = (val: points) {
	// 	database.ref('path/to/data').set(points)
	// 		.then(() => {
	// 			console.log('Данные успешно сохранены.');
	// 		})
	// 		.catch((error) => {
	// 			console.error('Ошибка при сохранении данных:', error);
	// 		});
	// }

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
								<button className='flex flex-col items-center gap-1'>
									<img src={bear} width={24} height={24} alt='High Voltage' />
									<span>Games</span>
								</button>
								<div className='h-[48px] w-[2px] bg-[#fddb6d]'></div>
								<button className='flex flex-col items-center gap-1'>
									<img src={coin} width={24} height={24} alt='High Voltage' />
									<span>AirDrop</span>
								</button>
								<div className='h-[48px] w-[2px] bg-[#fddb6d]'></div>
								<button className='flex flex-col items-center gap-1'>
									<img src={rocket} width={24} height={24} alt='High Voltage' />
									<span>Soon</span>
								</button>
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
