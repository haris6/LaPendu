import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Image,
  BackHandler,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import AppLovinMAX from 'react-native-applovin-max';

export default function StatsScreen({navigation, route}) {
  const category = route.params.category;
  const score = route.params.score;

  const backAction = () => {
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  const mybanner = Platform.select({
    android: '4b35f1d958ab927b',
  });

  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('../assets/background.png')}>
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{position: 'absolute', left: 5}}
            onPress={() => navigation.navigate('HomeScreen')}>
            <Image
              style={{height: 69, width: 69}}
              source={require('../assets/backButt.imageset/back.png')}></Image>
          </TouchableOpacity>
          <Text style={styles.header}>STATISTICS</Text>
        </View>
        <Text style={styles.subHeader}>{category.toUpperCase()}</Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 20,
            marginTop: 10,
            paddingBottom: 15,
            fontWeight: 'bold',
            letterSpacing: -0.8,
            color: 'black',
            marginBottom: '157%',
          }}>
          SCORE: {score}
        </Text>
      </View>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
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
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: -1.9,
    color: 'black',
  },
  subHeader: {
    textAlign: 'center',
    fontSize: 22,
    marginTop: 30,
    paddingBottom: 15,
    fontWeight: 'bold',
    letterSpacing: -0.8,
    color: 'black',
  },
  button: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 5,
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
