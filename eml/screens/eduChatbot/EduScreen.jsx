import React from 'react';
import { useState, useEffect } from 'react';
import { View, TextInput, ScrollView, RefreshControl, Pressable } from 'react-native';
import BaseScreen from '../../components/general/BaseScreen';
import IconHeader from '../../components/general/IconHeader';
import NetworkStatusObserver from '../../hooks/NetworkStatusObserver';

/**
 * Explore screen displays all courses and allows the user to filter them by category or search text.
 * @returns {JSX.Element} - Rendered component
 */
export default function Explore() {

	const [isOnline, setIsOnline] = useState(false);





	return (
		<>
			<NetworkStatusObserver setIsOnline={setIsOnline} />
			<BaseScreen className="h-screen flex flex-col">
				<IconHeader
					title={'Edu'}
					description={'Inscreva-se nos cursos do seu interesse e comece sua jornada'}
				/>
				{!isOnline ?
					<View>
						
					</View>
					:
					<View className="flex-1 bg-white flex justify-end">
						<TextInput
                            placeholder={'Pesquise aqui...'}
                            className="flex bg-blue border-2 rounded-3xl m-4 py-2 px-4"
                        />
					</View>
				}
			</BaseScreen>
		</>
	);
}