import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';

const TopLeaderboardItem = ({ rank, name, score, image, color, style }) => (
  <View style={[styles.topLeaderboardItem, style]}>
    <ImageBackground style={styles.leaderboardImage} source={image} resizeMode='cover' />
    <View style={[styles.rankBadge, { backgroundColor: color }]}>
      <Text style={styles.rankText}>{rank}</Text>
    </View>
    <Text style={styles.nameText}>{name}</Text>
    <Text style={styles.scoreText}>{score}</Text>
  </View>
);

const OtherLeaderboardItem = ({ rank, name, score, image }) => (
  <View style={styles.otherLeaderboardItem}>
    <Text style={styles.otherRankText}>{rank}</Text>
    <ImageBackground style={styles.otherLeaderboardImage} source={image} resizeMode='cover' />
    <Text style={styles.otherNameText}>{name}</Text>
    <Text style={styles.otherScoreText}>{score}</Text>
  </View>
);

const LeaderboardSection = ({ title, topItems, otherItems }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.topItemsContainer}>
      <TopLeaderboardItem {...topItems[1]} style={styles.topItemMedium} />
      <TopLeaderboardItem {...topItems[0]} style={styles.topItemLarge} />
      <TopLeaderboardItem {...topItems[2]} style={styles.topItemSmall} />
    </View>
    <View style={styles.otherItemsContainer}>
      {otherItems.map((item, index) => (
        <OtherLeaderboardItem key={index} {...item} />
      ))}
    </View>
  </View>
);

export default function App(): React.JSX.Element {
  const leaderboardData = [
    { rank: 1, name: 'Eiden', score: 2430, image: require('./image.png'), color: '#ffaa00' },
    { rank: 2, name: 'Jackson', score: 1847, image: require('./image.png'), color: '#009bd6' },
    { rank: 3, name: 'Emma Aria', score: 1674, image: require('./image.png'), color: '#00d95f' },
    { rank: 4, name: 'Olivia', score: 1500, image: require('./image.png'), color: '#ff5733' },
    { rank: 5, name: 'Liam', score: 1400, image: require('./image.png'), color: '#33ff57' },
    { rank: 6, name: 'Sophia', score: 1300, image: require('./image.png'), color: '#5733ff' },
    { rank: 7, name: 'Mason', score: 1200, image: require('./image.png'), color: '#ff33a6' },
    { rank: 8, name: 'Ava', score: 1100, image: require('./image.png'), color: '#33fff5' },
  ];

  const splitLeaderboardData = (data) => {
    const topItems = data.slice(0, 3);
    const otherItems = data.slice(3);
    return { topItems, otherItems };
  };

  const leaderboardSplitData = splitLeaderboardData(leaderboardData);

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <ImageBackground style={styles.icon} source={require('./image.png')} />
              <ImageBackground style={styles.icon} source={require('./image.png')} />
            </View>
            <Text style={styles.headerText}>Leaderboard</Text>
          </View>
          <LeaderboardSection topItems={leaderboardSplitData.topItems} otherItems={leaderboardSplitData.otherItems} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 390,
    height: 844,
    backgroundColor: '#151729',
    position: 'relative',
    overflow: 'hidden',
    marginTop: 0,
    marginRight: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
  },
  header: {
    width: 359,
    height: 40,
    position: 'relative',
    zIndex: 6,
    marginTop: 15,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 14,
  },
  iconContainer: {
    width: 32,
    height: 32,
    position: 'absolute',
    top: 0,
    left: 327,
    overflow: 'hidden',
  },
  icon: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '37.5%',
    left: 0,
    overflow: 'hidden',
    zIndex: 2,
  },
  headerText: {
    display: 'flex',
    height: 24,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    fontFamily: 'sans-serif',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
    color: '#ffffff',
    position: 'absolute',
    top: 13,
    left: 119,
    textAlign: 'left',
    zIndex: 6,
  },
  tabs: {
    width: 342,
    height: 50,
    backgroundColor: '#1e2237',
    borderRadius: 12,
    position: 'relative',
    zIndex: 7,
    marginTop: 40,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 24,
  },
  tabText: {
    height: 18,
    fontFamily: 'sans-serif',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 18,
    color: '#ffffff',
    position: 'relative',
    textAlign: 'left',
    zIndex: 10,
  },
  tabIndicator: {
    width: 45,
    height: 3,
    backgroundColor: '#699bf7',
    borderRadius: 10,
    position: 'relative',
    zIndex: 22,
    marginTop: 13,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 24,
  },
  section: {
    width: 342,
    position: 'relative',
    zIndex: 31,
    marginTop: 20,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 24,
  },
  sectionTitle: {
    height: 24,
    fontFamily: 'sans-serif',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
    color: '#ffffff',
    position: 'relative',
    textAlign: 'left',
    zIndex: 6,
    marginTop: 15,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 14,
  },
  topItemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  otherItemsContainer: {
    marginTop: 20,
  },
  topLeaderboardItem: {
    backgroundColor: '#252a40',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topItemLarge: {
    width: 110,
    height: 165,
  },
  topItemMedium: {
    width: 95,
    height: 140,
  },
  topItemSmall: {
    width: 80,
    height: 120,
  },
  otherLeaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252a40',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  leaderboardImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  otherLeaderboardImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  rankText: {
    fontFamily: 'sans-serif',
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  otherRankText: {
    fontFamily: 'sans-serif',
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 10,
  },
  nameText: {
    fontFamily: 'sans-serif',
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 5,
  },
  otherNameText: {
    fontFamily: 'sans-serif',
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    flex: 1,
  },
  scoreText: {
    fontFamily: 'sans-serif',
    fontSize: 16,
    fontWeight: '700',
    color: '#ffaa00',
    marginBottom: 5,
  },
  otherScoreText: {
    fontFamily: 'sans-serif',
    fontSize: 14,
    fontWeight: '700',
    color: '#ffaa00',
  },
  usernameText: {
    display: 'none',
  },
});






