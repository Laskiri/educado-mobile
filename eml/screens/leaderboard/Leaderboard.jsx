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
  <View className="bg-secondary" style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 10, width: rank === 1 ? 120 : rank === 2 ? 100 : 80, height: rank === 1 ? 160 : rank === 2 ? 140 : 120, borderRadius: 10 }}>
    <ImageBackground style={{ width: 60, height: 60, borderRadius: 30, marginBottom: 10 }} source={image ? { uri: image } : defaultImage} resizeMode='cover' />
    <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: rankColors[rank] || '#A9A9A9', alignItems: 'center', justifyContent: 'center', marginBottom: 5 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#000' }}>{rank}</Text>
    </View>
    <Text style={{ fontWeight: '500', fontSize: 16, color: '#000', marginBottom: 5 }}>{name}</Text>
    <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#FF6347', marginBottom: 5 }}>{score}</Text>
  </View>
);

const OtherLeaderboardItem = ({ rank, name, score, image }) => (
  <View className="bg-secondary" style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 10, padding: 10, marginBottom: 10 }}>
    <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#000', marginRight: 10 }}>{rank}</Text>
    <ImageBackground style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} source={image ? { uri: image } : defaultImage} resizeMode='cover' />
    <Text style={{ fontWeight: '500', fontSize: 14, color: '#000', flex: 1 }}>{name}</Text>
    <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#FF6347' }}>{score}</Text>
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
        <View className="white" style={{ width: '100%', padding: 20 }}>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 24, color: '#000', textAlign: 'center' }}>Leaderboard</Text>
          </View>
          {leaderboardData.length > 0 ? (
            <LeaderboardSection title="Top Players" topItems={leaderboardData.slice(0, 3)} otherItems={leaderboardData.slice(3)} />
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>No data available</Text>
          )}
          {loading && <ActivityIndicator size="large" color="#FF6347" />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}






