import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  const handleImagePress = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImagePress} style={styles.content}>
        <Image
          style={styles.image}
          source={require('../assets/images/logo.png')}
        />
        <Text style={styles.tagline}>Your favourite food, delivered fast</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  content: {
    alignItems: 'center',
  },
  image: {
    width: 280,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 14,
    color: '#2C3E50',
    marginTop: 10,
    fontStyle: 'italic',
  },
});