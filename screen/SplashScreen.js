import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    color: '#E67E22',
    marginTop: 10,
    fontStyle: 'italic',
  },
});