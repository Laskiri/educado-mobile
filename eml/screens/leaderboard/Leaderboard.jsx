
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function LeaderboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Luka is a loser</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 24,
    color: "#333",
  },
  emoji: {
    fontSize: 24,
    marginTop: 10,
  },
});