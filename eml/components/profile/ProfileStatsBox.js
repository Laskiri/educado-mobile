import React, { Fragment } from 'react';
import { View, Text, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import CustomProgressBar from '../exercise/Progressbar';
import PropTypes from 'prop-types';
import { Button } from '@rneui/base';
const ProfileStatsBox = ({ streak, points, leaderboardPosition, level, drawProgressBarOnly }) => {
	// Props
	ProfileStatsBox.propTypes = {
		streak: PropTypes.number,	// Optional, not provided if drawProgressBarOnly = true
		points: PropTypes.number.isRequired,
		leaderboardPosition: PropTypes.number,	// Optional, not provided if drawProgressBarOnly = true
		level: PropTypes.number.isRequired,
		drawProgressBarOnly: PropTypes.bool.isRequired
	};

	// Default values for optional props
	ProfileStatsBox.defaultProps = {
		streak: 0,
		leaderboardPosition: 0
	};

	// Calculate remaining points to next level-up (every 100 points)
	const pointsToNextLevel = 100 - (points % 100);

	// Progress through level (based on level-up for every 100 points)
	// e.g., 42 pts. (out of 100) = 42% progress, 128 pts. (out of 200) = 28% progress, etc.
	const levelProgressPercentage = points % 100;

	
		
	return (
		<View className='border rounded-lg border-lightGray p-4'>
			
			{/* Stats */}
			{/* Don't render if drawProgressOnly = true */}
			{!drawProgressBarOnly && (
				<Fragment>
					<View className='flex-row justify-between items-center mb-4'>

						{/* Streak (number of days in a row with points gained) */}
						<View className='flex-1 flex-col bg-badgesGreen items-center rounded-lg py-2 w-24 h-16'>
							<Image source={require('../../assets/images/profileFlame.png')} />
							<Text className='text-projectWhite font-sans-bold mt-2' numberOfLines={1} adjustsFontSizeToFit>
								{streak} dia seguido
							</Text>
						</View>

						{/* Points */}
						<View className='flex-1 flex-col bg-badgesPurple items-center rounded-lg py-2 mx-2 w-24 h-16'>
						
							<Image source={require('../../assets/images/profileCoin.png')} />
						
							<Text className='text-projectWhite font-sans-bold mt-2' numberOfLines={1} adjustsFontSizeToFit>
								{points} pontos
							</Text> 
						</View>

						{/* Leaderboard position */}
						<View className='flex-1 flex-col bg-badgesBlue items-center rounded-lg py-2 w-24 h-16'>
							<Image source={require('../../assets/images/profileLightning.png')} />
							<Text className='text-projectWhite font-sans-bold mt-2' numberOfLines={1} adjustsFontSizeToFit>
								{leaderboardPosition}º posição
							</Text>
						</View>
					</View>

					{/* Border divider line */}
					<View className='-mx-4 border-t border-lightGray mb-4'></View>
				</Fragment>
			)}

			{/* Level and progress bar */}
			<View className='flex flex-row justify-between mb-2'>
				<Text className='font-sans-bold text-primary_custom'>
					Nível {level}
				</Text>
				<CustomProgressBar className='flex flex-row' progress={levelProgressPercentage} width={65} height={1} displayLabel={false}/>
			</View>
	
			{/* Remaining points to next level-up */}
			<View>
				<Text className='text-primary_custom font-montserrat' numberOfLines={2} adjustsFontSizeToFit>
					Faltam apenas <Text style={{ fontWeight: 'bold' }}>{pointsToNextLevel} pts.</Text> para você mudar de nível, continue estudando para chegar lá 🥳
				</Text>
			</View>
			
		</View>
	);
};

export default ProfileStatsBox;