import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useProtein } from '../ProteinContext';

const HomeScreen: React.FC = () => {
  const { state } = useProtein();
  const progressPercentage = (state.totalConsumed / state.dailyGoal) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Protein Progress</Text>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {state.totalConsumed}g / {state.dailyGoal}g
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progressPercentage}%` }]}
          />
        </View>
      </View>

      <Text style={styles.motivationalText}>
        {progressPercentage >= 100
          ? "Great job! You've hit your protein goal for today!"
          : `Keep it up! You're ${Math.round(
              progressPercentage
            )}% of the way to your daily goal.`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 18,
    marginBottom: 5,
  },
  progressBar: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  motivationalText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;
