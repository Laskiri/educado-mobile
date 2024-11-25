import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

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

  const fetchLeaderboardData = async (page) => {
    try {
      const response = await axios.get(`/api/leaderboard?page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      return [];
    }
  };

  const loadMoreData = async () => {
    setLoading(true);
    const newData = await fetchLeaderboardData(page);
    setLeaderboardData((prevData) => [...prevData, ...newData]);
    setLoading(false);
  };

  useEffect(() => {
    const initializeLeaderboard = async () => {
      const initialData = await fetchLeaderboardData(1);
      setLeaderboardData(initialData);
      setLoading(false);

      // Fetch user rank
      const userResponse = await axios.get('/api/user');
      setUserRank(userResponse.data.rank);

      // Scroll to user rank
      if (scrollViewRef.current && userResponse.data.rank) {
        scrollViewRef.current.scrollTo({
          y: (userResponse.data.rank - 1) * 50, // Assuming each item is 50px tall
          animated: true,
        });
      }
    };

    initializeLeaderboard();
  }, []);

  const handleScroll = async (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
    const isCloseToTop = contentOffset.y <= 50;

    if (isCloseToBottom && !loading) {
      setPage((prevPage) => prevPage + 1);
      await loadMoreData();
    }

    if (isCloseToTop && page > 1 && !loading) {
      setPage((prevPage) => prevPage - 1);
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
          <LeaderboardSection topItems={leaderboardData.slice(0, 3)} otherItems={leaderboardData.slice(3)} />
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}






