import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';
import { useProtein } from '../ProteinContext';
import { NativeModules } from 'react-native';
const { FoodNLP } = NativeModules;

interface ScanResult {
  status: number;
  product: {
    product_name: string;
    nutriments: {
      proteins: number;
      proteins_serving: number;
    };
    nutriscore_data: {
      grade: string;
      score: number;
      proteins: number;
      proteins_points: number;
    };
    serving_quantity: number;
    serving_size: string;
  };
}

const commonProteinSources = [
  { name: 'Egg', pluralName: 'Eggs', aliases: ['Egg', 'Eggs'], protein: 6 },
  {
    name: 'Chicken Breast',
    pluralName: 'Chicken Breasts',
    aliases: ['Chicken Breast', 'Chicken Breasts', 'Chicken'],
    protein: 31,
  },
  {
    name: 'Greek Yogurt (1 cup)',
    pluralName: 'Greek Yogurts (1 cup)',
    aliases: ['Greek Yogurt', 'Greek Yogurts', 'Yogurt'],
    protein: 22,
  },
  {
    name: 'Almonds (1 oz)',
    pluralName: 'Almonds (1 oz)',
    aliases: ['Almond', 'Almonds'],
    protein: 6,
  },
  {
    name: 'Protein Shake',
    pluralName: 'Protein Shakes',
    aliases: ['Protein Shake', 'Protein Shakes', 'Shake'],
    protein: 25,
  },
  {
    name: 'Tofu (100g)',
    pluralName: 'Tofus (100g)',
    aliases: ['Tofu'],
    protein: 8,
  },
  {
    name: 'Tuna (3 oz)',
    pluralName: 'Tunas (3 oz)',
    aliases: ['Tuna'],
    protein: 20,
  },
  {
    name: 'Salmon (3 oz)',
    pluralName: 'Salmons (3 oz)',
    aliases: ['Salmon'],
    protein: 22,
  },
  {
    name: 'Beef Steak (3 oz)',
    pluralName: 'Beef Steaks (3 oz)',
    aliases: ['Beef Steak', 'Steak'],
    protein: 26,
  },
  {
    name: 'Cottage Cheese (1 cup)',
    pluralName: 'Cottage Cheeses (1 cup)',
    aliases: ['Cottage Cheese'],
    protein: 28,
  },
  {
    name: 'Lentils (1 cup)',
    pluralName: 'Lentils (1 cup)',
    aliases: ['Lentil', 'Lentils'],
    protein: 18,
  },
  {
    name: 'Peanut Butter (2 tbsp)',
    pluralName: 'Peanut Butters (2 tbsp)',
    aliases: ['Peanut Butter'],
    protein: 8,
  },
  {
    name: 'Edamame (1 cup)',
    pluralName: 'Edamames (1 cup)',
    aliases: ['Edamame'],
    protein: 17,
  },
  {
    name: 'Quinoa (1 cup)',
    pluralName: 'Quinoas (1 cup)',
    aliases: ['Quinoa'],
    protein: 8,
  },
  {
    name: 'Black Beans (1 cup)',
    pluralName: 'Black Beans (1 cup)',
    aliases: ['Black Bean', 'Black Beans'],
    protein: 15,
  },
  {
    name: 'Pork Chop (3 oz)',
    pluralName: 'Pork Chops (3 oz)',
    aliases: ['Pork Chop', 'Pork Chops'],
    protein: 23,
  },
  {
    name: 'Turkey Breast (3 oz)',
    pluralName: 'Turkey Breasts (3 oz)',
    aliases: ['Turkey Breast', 'Turkey Breasts', 'Turkey'],
    protein: 24,
  },
  {
    name: 'Shrimp (3 oz)',
    pluralName: 'Shrimps (3 oz)',
    aliases: ['Shrimp', 'Shrimps'],
    protein: 20,
  },
  {
    name: 'Pumpkin Seeds (1 oz)',
    pluralName: 'Pumpkin Seeds (1 oz)',
    aliases: ['Pumpkin Seed', 'Pumpkin Seeds'],
    protein: 7,
  },
  {
    name: 'Chia Seeds (1 oz)',
    pluralName: 'Chia Seeds (1 oz)',
    aliases: ['Chia Seed', 'Chia Seeds'],
    protein: 4,
  },
  // Add more items as needed
];

const TrackingScreen: React.FC = () => {
  const { state, dispatch } = useProtein();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanned, setScanned] = useState<boolean>(false);
  const [barcodeData, setBarcodeData] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [proteinAmount, setProteinAmount] = useState<number | null>(null);
  const [nutriScoreInsights, setNutriScoreInsights] = useState<string>('');
  const [manualProtein, setManualProtein] = useState<string>('');
  const [manualProductName, setManualProductName] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [parseFoods, setParsedFoods] = useState([]);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);
    setScanning(false);
    setBarcodeData(data);
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${data}.json`
      );
      const scanResult: ScanResult = await response.json();
      if (scanResult.status === 1) {
        setProductName(scanResult.product.product_name);
        setProteinAmount(
          scanResult.product.nutriments.proteins_serving ||
            scanResult.product.nutriments.proteins
        );

        // Generate Nutri-Score insights
        const { grade, score, proteins, proteins_points } =
          scanResult.product.nutriscore_data;
        const insights =
          `Nutri-Score: ${grade.toUpperCase()} (${score})\n` +
          `Protein content: ${proteins}g per 100g (${proteins_points} points)\n` +
          `Serving size: ${scanResult.product.serving_size}\n` +
          `${generateNutriScoreComment(grade, proteins_points)}`;
        setNutriScoreInsights(insights);
      } else {
        setProductName('Product not found');
        setProteinAmount(null);
        setNutriScoreInsights('');
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
      setProductName('Error fetching product data');
      setProteinAmount(null);
      setNutriScoreInsights('');
    }
  };

  const handleParseInput = async () => {
    try {
      const foods = await FoodNLP.parseFoodItems(userInput);
      setParsedFoods(foods);
      // Map the foods to their protein amounts
      const totalProtein = foods.reduce(
        (sum: number, food: string) => sum + getProteinAmount(food),
        0
      );
      // Log the total protein
      dispatch({
        type: 'ADD_LOG',
        payload: {
          id: Date.now(),
          amount: totalProtein,
          name: foods.join(', '),
          timestamp: new Date().toLocaleString(),
        },
      });
      // Reset input
      setUserInput('');
    } catch (error) {
      console.error(error);
    }
  };

  // Function to get protein amount
  const getProteinAmount = (foodName: string) => {
    const food = commonProteinSources.find(
      (item) => item.name.toLowerCase() === foodName.toLowerCase()
    );
    return food ? food.protein : 0;
  };

  const generateNutriScoreComment = (
    grade: string,
    proteinPoints: number
  ): string => {
    let comment = 'This product has ';
    if (grade === 'a' || grade === 'b') {
      comment += 'a good nutritional profile. ';
    } else if (grade === 'c') {
      comment += 'an average nutritional profile. ';
    } else {
      comment += 'a nutritional profile that could be improved. ';
    }

    if (proteinPoints >= 4) {
      comment += "It's an excellent source of protein!";
    } else if (proteinPoints >= 2) {
      comment += "It's a good source of protein.";
    } else {
      comment += "It's not a significant source of protein.";
    }

    return comment;
  };

  const addProtein = (source: 'scan' | 'manual') => {
    let amount: number, name: string;
    if (source === 'scan') {
      amount = proteinAmount || 0;
      name = productName;
    } else {
      amount = parseFloat(manualProtein);
      name = manualProductName || 'Unnamed product';
    }

    if (!isNaN(amount) && amount > 0) {
      dispatch({
        type: 'ADD_LOG',
        payload: {
          id: Date.now(),
          amount,
          name,
          timestamp: new Date().toLocaleString(),
        },
      });

      // Reset states
      setBarcodeData('');
      setProductName('');
      setProteinAmount(null);
      setNutriScoreInsights('');
      setManualProtein('');
      setManualProductName('');
    } else {
      alert('Please enter a valid protein amount');
    }
  };

  const renderScanner = () => (
    <View style={styles.scannerContainer}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['ean8', 'ean13'],
        }}
      />
      <TouchableOpacity
        style={styles.closeScannerButton}
        onPress={() => setScanning(false)}
      >
        <FontAwesome name="close" size={24} color="white" />
      </TouchableOpacity>
      {scanned && (
        <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
      )}
    </View>
  );
  const renderManualEntry = () => (
    <View style={styles.manualEntryContainer}>
      <TextInput
        style={styles.input}
        placeholder="What did you eat?"
        value={userInput}
        onChangeText={setUserInput}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleParseInput}>
        <Text style={styles.submitButtonText}>Log Food</Text>
      </TouchableOpacity>
    </View>
  );

  const renderManualEntry_old = () => (
    <View style={styles.manualEntryContainer}>
      <TextInput
        style={styles.input}
        placeholder="Enter protein amount (g)"
        value={manualProtein}
        onChangeText={setManualProtein}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter food name (optional)"
        value={manualProductName}
        onChangeText={setManualProductName}
      />
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Log Protein</Text>
      </TouchableOpacity>
      {/* <Button title="Log Protein" onPress={() => addProtein('manual')} /> */}
    </View>
  );

  const renderScannedResult = () => (
    <View style={styles.resultContainer}>
      <Text style={styles.resultText}>Barcode: {barcodeData}</Text>
      <Text style={styles.resultText}>Product: {productName}</Text>
      <Text style={styles.resultText}>
        Protein:{' '}
        {proteinAmount !== null ? `${proteinAmount}g per serving` : 'N/A'}
      </Text>
      <Text style={styles.resultText}>{nutriScoreInsights}</Text>
      <Button title="Log This Protein" onPress={() => addProtein('scan')} />
    </View>
  );

  const renderLogs = () => (
    <ScrollView style={styles.logsContainer}>
      {state.logs.map((log) => (
        <View key={log.id} style={styles.logItem}>
          <Text style={styles.logText}>
            {log.amount}g protein - {log.name}
          </Text>
          <Text style={styles.logTimestamp}>{log.timestamp}</Text>
        </View>
      ))}
    </ScrollView>
  );

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {scanning ? (
        renderScanner()
      ) : (
        <>
          <Button
            title="Scan Barcode"
            onPress={() => {
              setScanning(true);
              setScanned(false);
            }}
          />
          {barcodeData ? renderScannedResult() : renderManualEntry()}
          {renderLogs()}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  closeScannerButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 20,
  },
  manualEntryContainer: {
    marginVertical: 20,
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 20,
    borderRadius: 10,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  logsContainer: {
    flex: 1,
    marginTop: 20,
  },
  logItem: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  logText: {
    fontSize: 16,
  },
  logTimestamp: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
});

export default TrackingScreen;
