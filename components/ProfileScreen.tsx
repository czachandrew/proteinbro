import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
type GenderOptions = 'M' | 'F';
const ProfileScreen = ({}) => {
  const [currentWeight, setCurrentWeight] = useState<string>('155');
  const [targetWeight, setTargetWeight] = useState<string>('155');
  const [height, setHeight] = useState<string>('72');
  const [age, setAge] = useState<string>('40');
  const [gender, setGender] = useState<GenderOptions>('M');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSaveProfile = () => {
    console.log('Profile is saving');
    if (!currentWeight || !targetWeight || !height || !age || !gender) {
      console.log('All values are required');
      return;
    }
    console.log({
      currentWeight,
      targetWeight,
      height,
      age,
      gender,
    });
  };

  return (
    <View style={styles.container}>
      <Text>Protein Profile Bro!</Text>
      <Text style={styles.inputLabel}>Current Weight:</Text>
      <TextInput
        style={styles.input}
        value={currentWeight}
        onChangeText={setCurrentWeight}
        placeholder="Enter current weight"
        keyboardType="numeric"
      />
      <Text>
        Are you trying to gain/loose/maintain? What's your target weight?
      </Text>
      <TextInput
        style={styles.input}
        value={targetWeight}
        onChangeText={setTargetWeight}
        placeholder="Enter target weight"
        keyboardType="numeric"
      />
      <Text>Height in inches:</Text>
      <TextInput
        style={styles.input}
        value={height}
        onChangeText={setHeight}
        placeholder="Enter your height:"
      />
      <Text>Age:</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        placeholder="Enter your age"
      />
      <Button title="Save Profile" onPress={handleSaveProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  inputLabel: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#ccc',
    width: 500,
    color: '#eee',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default ProfileScreen;
