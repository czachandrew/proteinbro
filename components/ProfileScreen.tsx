import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useProtein } from '../ProteinContext';
type GenderOptions = 'M' | 'F';
type ActivityOptions =
  | 'Sedentary'
  | 'Moderate'
  | 'Very Active'
  | 'Intense Training';
const ProfileScreen = ({}) => {
  const { state, dispatch } = useProtein();
  const [currentWeight, setCurrentWeight] = useState<string>('155');
  const [targetWeight, setTargetWeight] = useState<string>('155');
  const [height, setHeight] = useState<string>('72');
  const [age, setAge] = useState<string>('40');
  const [gender, setGender] = useState<GenderOptions>('M');
  const [activityLevel, setActivityLevel] =
    useState<ActivityOptions>('Moderate');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSaveProfile = () => {
    console.log('Profile is saving');
    if (!currentWeight || !targetWeight || !height || !age || !gender) {
      console.log('All values are required');
      setErrorMessage('All fields are required');
      return;
    }
    setErrorMessage(null);
    console.log('Profile saved');
    console.log({
      currentWeight,
      targetWeight,
      height,
      age,
      gender,
    });
    const weight = parseFloat(targetWeight) / 2.205;
    const proteinGoal = calculateProteinGoal(weight, activityLevel);
  };

  const calculateProteinGoal = (
    weight: number,
    activityLevel: ActivityOptions
  ) => {
    let activityFactor;
    if (!targetWeight) {
      setErrorMessage(
        'We need your target weight to compute your protein needs, bro'
      );
    }

    switch (activityLevel) {
      case 'Sedentary':
        activityFactor = 1.2;
        break;
      case 'Moderate':
        activityFactor = 1.6;
        break;
      case 'Very Active':
        activityFactor = 2.0;
        break;
      case 'Intense Training':
        activityFactor = 2.2;
    }

    const goal = weight * activityFactor;
    dispatch({ type: 'SET_DAILY_GOAL', payload: goal });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text>Protein Profile Bro! Goal: {state.dailyGoal}</Text>
        <Text style={styles.inputLabel}>Gender</Text>
        <Picker
          selectedValue={gender}
          onValueChange={(value: GenderOptions) => setGender(value)}
        >
          <Picker.Item label="Male" value="M" />
          <Picker.Item label="Female" value="F" />
        </Picker>
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
        <Text>Activity Level:</Text>
        <Picker
          selectedValue={activityLevel}
          onValueChange={(value: ActivityOptions) => setActivityLevel(value)}
        >
          <Picker.Item label="Sedentary" value="Sedentary" />
          <Picker.Item label="Moderate" value="Moderate" />
          <Picker.Item label="Very Active" value="Very Active" />
          <Picker.Item label="Intense Training" value="Intense Training" />
        </Picker>
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        {/* <Button title="Save Profile" onPress={handleSaveProfile} /> */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.saveButton}
          onPress={calculateProteinGoal}
        >
          <Text style={styles.saveButtonText}>Calculate Protein</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  inputLabel: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#ccc',
    width: 500,
    color: '#eee',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
