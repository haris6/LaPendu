import {StyleSheet, Text, View, Image, ImageBackground} from 'react-native';
import React, {useState, useEffect} from 'react';
import AppLovinMAX from 'react-native-applovin-max';
import AnimatedEllipsis from 'react-native-animated-ellipsis';

export default function MainScreen({navigation}) {
  const [dots, setDots] = useState('●');
  const [count, setCount] = useState(0);

  // copied from applovin documentation
  const mybanner = Platform.select({
    android: '1b1564c66be3d695', //ids from applovin ads
    ios: '0512dbade22682b1',
  });

  const loading = () => {
    return (
      <AnimatedEllipsis
        numberOfDots={3}
        animationDelay={150}
        style={{
          color: 'black',
          fontSize: 80,
          letterSpacing: -8,
          fontWeight: 'bold',
        }}
      />
    );
  };

  setTimeout(() => {
    navigation.navigate('HomeScreen');
  }, 1975);

  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('../assets/background.png')}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View>
          <Text style={styles.header}>LE PENDU</Text>
          <Image
            style={{
              marginTop: 55,
              height: 100,
              width: 100,
              alignSelf: 'center',
            }}
            source={require('../assets/hangman.png')}></Image>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 50,
            }}>
            {loading()}
          </View>
        </View>
      </View>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        {/* copied from applovin documentation */}
        <AppLovinMAX.AdView
          adUnitId={mybanner}
          adFormat={AppLovinMAX.AdFormat.BANNER}
          style={styles.banner}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 60,
    marginTop: 50,
    fontWeight: 'bold',
    letterSpacing: -1.9,
    color: 'black',
    textShadowColor: 'grey',
    alignSelf: 'center',
    textShadowOffset: {height: 2.5, width: 2.5},
    textShadowRadius: 2,
  },
  banner: {
    borderRadius: 25,
    height: AppLovinMAX.isTablet() ? 90 : 50,
    bottom: Platform.select({
      ios: '15%',
      android: '15%',
    }),
  },
});
