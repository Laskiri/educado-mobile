import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLeaderboardDataAndUserRank } from '../../api/api';

const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const getInitials = (name) => {
  if (!name) return '';
  const nameParts = name.split(' ');
  if (nameParts.length >= 2) {
    return `${capitalize(nameParts[0][0])}${capitalize(nameParts[1][0])}`;
  }
  return capitalize(name[0]);
};

const getSizeStyle = (rank) => {
  switch (rank) {
    case 1:
      return { width: 100, height: 100, borderRadius: 50 };
    case 2:
      return { width: 70, height: 70, borderRadius: 35 };
    case 3:
      return { width: 60, height: 60, borderRadius: 30 };
    default:
      return { width: 70, height: 70, borderRadius: 35 };
  }
};

const getFontSizeStyle = (rank) => {
  switch (rank) {
    case 1:
      return { fontSize: 40 }; // Increased font size for rank 1
    case 2:
      return { fontSize: 25 }; // Increased font size for rank 2
    case 3:
      return { fontSize: 15 }; // Increased font size for rank 3
    default:
      return { fontSize: 28 }; // Increased font size for other ranks
  }
};

const truncateName = (name, containerWidth, fontSize) => {
  if (!name) return '';
  const capitalized = name.split(' ').map(capitalize).join(' ');
  const maxWidth = containerWidth - 60; // Adjust based on the layout
  const charWidth = fontSize * 0.5; // Approximate width of a character
  const maxChars = Math.floor(maxWidth / charWidth);

  if (capitalized.length > maxChars) {
    return `${capitalized.substring(0, maxChars)}...`;
  }
  return capitalized;
};

const TopLeaderboardUsers = ({ points, profilePicture, username, rank }) => (
  <View style={styles.topContainer}>
    <Text style={styles.points}>{points} pts</Text>
    <View style={styles.circleContainer}>
      <View style={[styles.circle, getSizeStyle(rank)]}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={[styles.profileImage, getSizeStyle(rank)]} />
        ) : (
          <Text style={[styles.un, getFontSizeStyle(rank)]}>{getInitials(username)}</Text>
        )}
        <View style={styles.rank}>
          <Text style={styles.rankText}>{rank}º</Text>
        </View>
      </View>
    </View>
    <Text style={styles.userName}>{truncateName(username)}</Text>
  </View>
);

const LeaderboardList = ({ rank, points, profilePicture, username, highlight }) => (
  <View style={styles.listRoot}>
    <View style={[styles.listContainer, highlight && { backgroundColor: '#186474' }]}>
      <Text style={[styles.listRank, highlight && { color: '#FAC12F' }]}>{rank}</Text>
      <View style={[styles.frame2273, highlight && { borderColor: '#FAC12F' }]}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.listProfileImage} />
        ) : (
          <Text style={[styles.un, highlight && { color: '#FFFFFF' }]}>{getInitials(username)}</Text>
        )}
      </View>
      <Text style={[styles.listUserName, highlight && { color: '#FFFFFF' }]}>
        {truncateName(username, 200, 18)} {/* Adjust containerWidth and fontSize as needed */}
      </Text>
      <Text style={[styles.listPoints, highlight && { color: '#FFFFFF' }]}>{points} pts</Text>
    </View>
  </View>
);

export function LeaderboardScreen() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const scrollViewRef = useRef(null);

  const loadMoreData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('@loginToken');
      if (!token) throw new Error('User not authenticated');
      const { leaderboard } = await getLeaderboardDataAndUserRank(page, token, 'all', 12);
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
      const response = await getLeaderboardDataAndUserRank(1, token, 'all', 12);
      setLeaderboardData(response.leaderboard || []);
      setCurrentUserRank(response.currentUserRank);
      setLoading(false);

      if (scrollViewRef.current && response.currentUserRank) {
        const pageToScroll = Math.ceil(response.currentUserRank / 30);
        setPage(pageToScroll);
        scrollViewRef.current.scrollTo({
          y: (response.currentUserRank - 1) * 50,
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

  const renderLeaderboard = () => {
    const topUsers = leaderboardData.slice(0, 3);
    const remainingUsers = leaderboardData.slice(3);

    if (currentUserRank <= 8) {
      return remainingUsers.slice(0, 9).map((user) => (
        <LeaderboardList
          key={user.rank}
          rank={user.rank}
          points={user.score}
          profilePicture={user.image}
          username={user.name}
          highlight={user.rank === currentUserRank}
        />
      ));
    } else {
      const topSixUsers = remainingUsers.slice(0, 3);
      const currentUserIndex = remainingUsers.findIndex(user => user.rank === currentUserRank);
      const adjacentUsers = remainingUsers.slice(Math.max(currentUserIndex - 1, 0), Math.min(currentUserIndex + 18, remainingUsers.length));

      return (
        <>
          {topSixUsers.map(user => (
            <LeaderboardList
              key={user.rank}
              rank={user.rank}
              points={user.score}
              profilePicture={user.image}
              username={user.name}
            />
          ))}
          <Text style={styles.ellipsis}>⋮</Text>
          {adjacentUsers.map(user => (
            <LeaderboardList
              key={user.rank}
              rank={user.rank}
              points={user.score}
              profilePicture={user.image}
              username={user.name}
              highlight={user.rank === currentUserRank}
            />
          ))}
        </>
      );
    }
  };

  const topUsers = leaderboardData.slice(0, 3);

  return (
    <View style={styles.container}>
      <Text style={styles.rankingText}>Ranking</Text> 
      <ScrollView
        ref={scrollViewRef}
        contentInsetAdjustmentBehavior="never"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
      >
        <View style={styles.topUsersContainer}>
          {topUsers[1] && (
            <TopLeaderboardUsers
              points={topUsers[1].score}
              profilePicture={topUsers[1].image}
              username={topUsers[1].name}
              rank={topUsers[1].rank}
            />
          )}
          {topUsers[0] && (
            <TopLeaderboardUsers
              points={topUsers[0].score}
              profilePicture={topUsers[0].image}
              username={topUsers[0].name}
              rank={topUsers[0].rank}
            />
          )}
          {topUsers[2] && (
            <TopLeaderboardUsers
              points={topUsers[2].score}
              profilePicture={topUsers[2].image}
              username={topUsers[2].name}
              rank={topUsers[2].rank}
            />
          )}
        </View>
        {renderLeaderboard()}
        {loading && <ActivityIndicator size="large" color="#FF6347" />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f9fb', // Updated background color
    paddingTop: 40, // Added padding to the top
  },
  topUsersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  topContainer: {
    width: 120,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  points: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Montserrat-SemiBold',
    color: '#333333',
    marginBottom: 8,
  },
  circleContainer: {
    marginBottom: 8,
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#186474', // Updated ellipse color
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },
  un: {
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
    color: '#FFFFFF',
  },
  rank: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: '#FAC12F',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
    color: '#2F4858',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Montserrat-SemiBold',
    color: '#333333',
  },
  listRoot: {
    paddingHorizontal: 15,
    alignSelf: 'stretch',
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 0,
  },
  listRank: {
    minWidth: 40,
    textAlign: 'center',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  frame2273: {
    width: 51,
    height: 51,
    borderRadius: 25.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF', // Default border color
    backgroundColor: '#186474',
    marginHorizontal: 10,
  },
  listProfileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  listUserName: {
    flex: 1,
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    fontWeight: '400',
    color: '#333333',
  },
  listPoints: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    fontWeight: '400',
    color: '#333333',
  },
  highlight: {
    backgroundColor: 'orange',
  },
  ellipsis: {
    textAlign: 'center',
    fontSize: 24,
    marginVertical: 10,
  },
  rankingText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#333333',
  },
});

export default LeaderboardScreen;