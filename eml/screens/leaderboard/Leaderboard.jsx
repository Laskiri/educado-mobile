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

const defaultImage = require('./image.png');

const rankColors = {
  1: '#FFA500', // Orange
  2: '#1E90FF', // Blue
  3: '#32CD32', // Green
};

const TopLeaderboardItem = ({ rank, name, score, image }) => (
  <View className={`bg-secondary items-center justify-center mb-2 ${rank === 1 ? 'w-30 h-40' : rank === 2 ? 'w-25 h-35' : 'w-20 h-30'} rounded-lg`}>
    <ImageBackground className="w-10 h-10 rounded-full mr-2" source={image ? { uri: image } : defaultImage} resizeMode='cover' />
    <View className="w-7 h-7 rounded-full items-center justify-center mb-1" style={{ backgroundColor: rankColors[rank] || '#A9A9A9' }}>
      <Text className="font-bold text-sm text-black">{rank}</Text>
    </View>
    <Text className="font-medium text-lg text-black mb-1">{name}</Text>
    <Text className="font-bold text-xl text-red-500 mb-1">{score}</Text>
  </View>
);

const OtherLeaderboardItem = ({ rank, name, score, image }) => (
  <View className="bg-secondary flex-row items-center rounded-lg p-2 mb-2">
    <Text className="font-bold text-sm text-black mr-2">{rank}</Text>
    <ImageBackground className="w-10 h-10 rounded-full mr-2" source={image ? { uri: image } : defaultImage} resizeMode='cover' />
    <Text className="font-medium text-sm text-black flex-1">{name}</Text>
    <Text className="font-bold text-sm text-red-500">{score}</Text>
  </View>
);

const LeaderboardSection = ({ title, topItems, otherItems }) => (
  <View style={{ marginTop: 20, marginHorizontal: 20 }}>
    <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#000', marginBottom: 10 }}>{title}</Text>
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', marginBottom: 20 }}>
      <TopLeaderboardItem {...topItems[1]} />
      <TopLeaderboardItem {...topItems[0]} />
      <TopLeaderboardItem {...topItems[2]} />
    </View>
    <View>
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
    if (loading) return;
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('@loginToken');
      if (!token) throw new Error('User not authenticated');
      const { leaderboard } = await getLeaderboardDataAndUserRank(page, token, 'all');
      if (leaderboard.length === 0) {
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
      if (!token) throw new Error('User not authenticated');
      const response = await getLeaderboardDataAndUserRank(1, token, 'all');
      setLeaderboardData(response.leaderboard || []);
      setUserRank(response.rank);
      setLoading(false);

      if (scrollViewRef.current && response.rank) {
        const pageToScroll = Math.ceil(response.rank / 30);
        setPage(pageToScroll);
        scrollViewRef.current.scrollTo({
          y: (response.rank - 1) * 50,
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
        <View className="white w-full p-5">
          <View className="mb-5">
            <Text className="font-bold text-2xl text-black text-center">Leaderboard</Text>
          </View>
          {leaderboardData.length > 0 ? (
            <LeaderboardSection title="Top Players" topItems={leaderboardData.slice(0, 3)} otherItems={leaderboardData.slice(3)} />
          ) : (
            <Text className="text-center mt-5">No data available</Text>
          )}
          {loading && <ActivityIndicator size="large" color="#FF6347" />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}






