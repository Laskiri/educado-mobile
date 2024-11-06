import React, { Fragment } from 'react';
import { View, Text, Image } from 'react-native';
import CustomProgressBar from '../exercise/Progressbar';
import PropTypes from 'prop-types';

const ProfileStatsBox = ({ points, studentLevel, leaderboardPosition, numberOfDaysInRow, drawProgressBarOnly }) => {
	
	// Props
	ProfileStatsBox.propTypes = {
		points: PropTypes.number.isRequired,
		studentLevel: PropTypes.number.isRequired,
		leaderboardPosition: PropTypes.number,	// Optional, not provided if drawProgressBarOnly = true
		numberOfDaysInRow: PropTypes.number,	// Optional, not provided if drawProgressBarOnly = true
		drawProgressBarOnly: PropTypes.bool.isRequired
	};

	// Default values for optional props
	ProfileStatsBox.defaultProps = {
		leaderboardPosition: null,
		numberOfDaysInRow: null
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

						{/* Number of days in a row */}
						<View className='flex-1 flex-col bg-badgesGreen items-center rounded-lg py-2 w-24 h-16'>
							<Image source={require('../../assets/images/profileFlame.png')} />
							<Text className='text-projectWhite font-sans-bold mt-2' numberOfLines={1} adjustsFontSizeToFit>
								{numberOfDaysInRow} dia seguido
							</Text>
						</View>

						{/* Points */}
						<View className='flex-1 flex-col bg-badgesPurple items-center rounded-lg py-2 mx-2 w-24 h-16'>
							<Image source={require('../../assets/images/profileCoin.png')} />
							<Text className='text-projectWhite font-sans-bold mt-2' numberOfLines={1} adjustsFontSizeToFit>
								{points} pontos
							</Text> 
						</View>

						{/* Position */}
						<View className='flex-1 flex-col bg-badgesBlue items-center rounded-lg py-2 w-24 h-16'>
							<Image source={require('../../assets/images/profileLightning.png')} />
							<Text className='text-projectWhite font-sans-bold mt-2' numberOfLines={1} adjustsFontSizeToFit>
								{leaderboardPosition}º posição
							</Text>
						</View>
					</View>

					{/* Divider line */}
					<View className='-mx-4 border-t border-lightGray mb-4'></View>
				</Fragment>
			)}

			{/* Level, progress bar and remaining points for next level-up */}
			<View className='flex flex-row justify-between mb-2'>
				<Text className='font-sans-bold text-primary_custom'>
					Nível {studentLevel}
				</Text>
				<CustomProgressBar className='flex flex-row' progress={levelProgressPercentage} width={65} height={1} displayLabel={false}/>
			</View>
	
			{/* Points to next level */}
			<View>
				<Text className='text-primary_custom font-montserrat'>
					Faltam apenas {pointsToNextLevel} pontos para você mudar de nível, continue estudando para chegar lá 🥳
				</Text>
			</View>
			
		</View>
	);
};

export default ProfileStatsBox;