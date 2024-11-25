import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLeaderboardDataAndUserRank } from '../../api/api';

const TopLeaderboardItem = ({ rank, name, score, image, color, style }) => (
  <View className={`bg-secondary rounded-md mb-2 items-center justify-center ${style}`}>
    <ImageBackground className="w-12 h-12 rounded-full mb-2" source={{ uri: image }} resizeMode='cover' />
    <View className={`w-6 h-6 rounded-full items-center justify-center mb-1`} style={{ backgroundColor: color }}>
      <Text className="font-sans-bold text-xs text-black">{rank}</Text>
    </View>
    <Text className="font-sans-medium text-sm text-black mb-1">{name}</Text>
    <Text className="font-sans-bold text-base text-primary_custom mb-1">{score}</Text>
  </View>
);

const OtherLeaderboardItem = ({ rank, name, score, image }) => (
  <View className="flex-row items-center bg-secondary rounded-md p-2 mb-2">
    <Text className="font-sans-bold text-sm text-black mr-2">{rank}</Text>
    <ImageBackground className="w-8 h-8 rounded-full mr-2" source={{ uri: image }} resizeMode='cover' />
    <Text className="font-sans-medium text-sm text-black flex-1">{name}</Text>
    <Text className="font-sans-bold text-sm text-primary_custom">{score}</Text>
  </View>
);

const LeaderboardSection = ({ title, topItems, otherItems }) => (
  <View className="relative z-31 mt-5 mx-6">
    <Text className="font-sans-bold text-lg text-black relative mt-4 ml-4">{title}</Text>
    <View className="flex-row justify-around items-end mt-2">
      <TopLeaderboardItem {...topItems[1]} style="w-24 h-36" />
      <TopLeaderboardItem {...topItems[0]} style="w-28 h-40" />
      <TopLeaderboardItem {...topItems[2]} style="w-20 h-32" />
    </View>
    <View className="mt-5">
      {otherItems.map((item, index) => (
        <OtherLeaderboardItem key={index} {...item} />
      ))}
    </View>
  </View>
);

export default function App(): React.JSX.Element {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [userRank, setUserRank] = useState(null);
  const scrollViewRef = useRef(null);

  const loadMoreData = async () => {
    if (loading) return; // Prevent multiple fetches at the same time
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('@loginToken');
      if (!token) {
        throw new Error('User not authenticated');
      }
      const { leaderboard } = await getLeaderboardDataAndUserRank(page, token, 'all'); // Add valid time interval
      if (leaderboard.length === 0) {
        // No more data to fetch
        setLoading(false);
        return;
      }
      setLeaderboardData((prevData) => {
        const newData = leaderboard.filter(item => !prevData.some(prevItem => prevItem.rank === item.rank));
        return [...prevData, ...newData];
      });
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error loading more data:', error);
      Alert.alert('Error', error.message || 'Server could not be reached');
    } finally {
      setLoading(false);
    }
  };

  const initializeLeaderboard = async () => {
    try {
      const token = await AsyncStorage.getItem('@loginToken');
      if (!token) {
        throw new Error('User not authenticated');
      }
      console.log('Fetching leaderboard data...');
      const response = await getLeaderboardDataAndUserRank(1, token, 'all'); // Add valid time interval
      console.log('Leaderboard data fetched:', response);
      setLeaderboardData(response.leaderboard || []); // Ensure leaderboardData is an array
      setUserRank(response.rank);
      setLoading(false);

      // Scroll to user rank
      if (scrollViewRef.current && response.rank) {
        const pageToScroll = Math.ceil(response.rank / 30); // Assuming 30 items per page
        setPage(pageToScroll);
        scrollViewRef.current.scrollTo({
          y: (response.rank - 1) * 50, // Assuming each item is 50px tall
          animated: true,
        });
      }
    } catch (error) {
      console.error('Error initializing leaderboard:', error);
      Alert.alert('Error', error.message || 'Server could not be reached');
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeLeaderboard();
  }, []);

  const handleScroll = async (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;

    if (isCloseToBottom && !loading) {
      await loadMoreData();
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <ScrollView
        ref={scrollViewRef}
        contentInsetAdjustmentBehavior='automatic'
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View className="w-96 h-full bg-primary relative overflow-hidden mx-auto">
          <View className="w-90 h-10 relative z-6 mt-4 ml-4">
            <View className="w-8 h-8 absolute top-0 left-80 overflow-hidden">
              <ImageBackground className="w-full h-full absolute top-1/2 left-0 overflow-hidden z-2" source={require('./image.png')} />
              <ImageBackground className="w-full h-full absolute top-1/2 left-0 overflow-hidden z-2" source={require('./image.png')} />
            </View>
            <Text className="flex h-6 justify-start items-start font-sans-bold text-lg text-black absolute top-3 left-30 text-left z-6">Leaderboard</Text>
          </View>
          {leaderboardData.length > 0 ? (
            <LeaderboardSection topItems={leaderboardData.slice(0, 3)} otherItems={leaderboardData.slice(3)} />
          ) : (
            <Text className="text-center mt-10">No data available</Text>
          )}
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}






