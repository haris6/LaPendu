import React, {useState, useEffect} from 'react';
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
import words from '../data.json';
import AppLovinMAX from 'react-native-applovin-max';

const getImage = strike => {
  switch (strike) {
    case 1:
      return require('../assets/icons/game/h1.imageset/1.png');
    case 2:
      return require('../assets/icons/game/h2.imageset/1.png');
    case 3:
      return require('../assets/icons/game/h3.imageset/1.png');
    case 4:
      return require('../assets/icons/game/h4.imageset/1.png');
    case 5:
      return require('../assets/icons/game/h5.imageset/1.png');
    case 6:
      return require('../assets/icons/game/h6.imageset/1.png');
    default:
      return null;
  }
};

export default function GameScreen({navigation, route}) {
  const data = route.params;
  const [randomWord, setrandomWord] = useState('');
  const [letters, setLetters] = useState('');
  const [pressed, setPressed] = useState('');
  const [score, setScore] = useState(-1);
  const [count, setCount] = useState(0);
  const [strike, setStrike] = useState(0);
  const [retryAttempt, setRetryAttempt] = useState(0);
  let wordArray = words[data.item];
  const category = data.item;
  const alphabet1 = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
  ];
  const alphabet2 = ['v', 'w', 'x', 'y', 'z'];

  // copied from applovin documentation
  const mybanner = Platform.select({
    android: '3a8e976be157ff64',//ids from applovin
    ios: 'a35c48b69c06607e',
  });
  
  // copied from applovin documentation
  const myinterstitial = Platform.select({
    android: 'c610fb63a0e41e0c',//ids from applovin
    ios: 'eff328c0d5c4ac9e',
  });

  const navigateMe = () => {
    navigation.navigate('StatsScreen', {category: category, score: score, word: randomWord});
  };

  const backAction = () => {
    return false;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  useEffect(() => {
    let myWord = wordArray[Math.floor(Math.random() * wordArray.length)];
    setrandomWord(myWord);
    if ( score % 2 == 0 && score != 0 ) {
      // copied from applovin documentation
      loadInterstitial();
      if (AppLovinMAX.isInterstitialReady(myinterstitial)) {
         AppLovinMAX.showInterstitial(myinterstitial);
      } else {
        console.log('Interstitial ad did not load. either check internet connectivity or admob, applovin, chartboost account and ads');
      }
    }
  }, [score]);

  
  useEffect(() => {
    if (strike == 6) {
      console.log('GAME OVER');
      setCount(0);
      setStrike(0);
      setLetters('');
      setScore(0);
      navigateMe();
    }
  }, [strike]);
  
  
  useEffect(() => {
    if (randomWord.length == count) {
      setCount(0);
      setStrike(0);
      setScore(score + 1);
      console.log("Round completed");
      setPressed('');
      setLetters('');
    }
  }, [count]);

  const letterClick = item => {
    if (randomWord.includes(item)) {
      if (!letters.includes(item)) {
        let increment = randomWord.split(item).length - 1;
        count == 0 ? (increment += randomWord.split(' ').length - 1) : '';
        setCount(count + increment);
        setLetters(letters + item);
      }
    } else {
      if (pressed.includes(item)) {
        return;
      }
      setStrike(strike + 1);
    }
    setPressed(pressed + item);
  };
  
  // copied from applovin documentation
  const initializeInterstitialAds = () => {
    AppLovinMAX.addEventListener('OnInterstitialLoadedEvent', () => {
      // Interstitial ad is ready to be shown. AppLovinMAX.isInterstitialReady(INTERSTITIAL_AD_UNIT_ID) will now return 'true'

      // Reset retry attempt
      setRetryAttempt(0);
    });
    AppLovinMAX.addEventListener('OnInterstitialLoadFailedEvent', () => {
      // Interstitial ad failed to load
      // We recommend retrying with exponentially higher delays up to a maximum delay (in this case 64 seconds)

      setRetryAttempt(retryAttempt + 1);
      var retryDelay = Math.pow(2, Math.min(6, retryAttempt));

      console.log(
        'Interstitial ad failed to load - retrying in ' + retryDelay + 's',
      );

      setTimeout(function () {
        loadInterstitial();
      }, retryDelay * 1000);
    });
    AppLovinMAX.addEventListener('OnInterstitialClickedEvent', () => {});
    AppLovinMAX.addEventListener('OnInterstitialDisplayedEvent', () => {});
    AppLovinMAX.addEventListener('OnInterstitialAdFailedToDisplayEvent', () => {
      // Interstitial ad failed to display. We recommend loading the next ad
      loadInterstitial();
    });
    AppLovinMAX.addEventListener('OnInterstitialHiddenEvent', () => {
      loadInterstitial();
    });

    // Load the first interstitial
    loadInterstitial();
  }

  // copied from applovin documentation
  function loadInterstitial() {
    AppLovinMAX.loadInterstitial(myinterstitial);
  }

  initializeInterstitialAds();

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
            onPress={() => navigation.navigate('HomeScreen',{category:category})}>
            <Image
              style={{height: 69, width: 69}}
              source={require('../assets/backButt.imageset/back.png')}></Image>
          </TouchableOpacity>
          <Text style={styles.header}>{category.toUpperCase()}</Text>
        </View>
        <View
          style={{
            marginLeft: 20,
            marginTop: 30,
            position: 'relative',
            height: 120,
            flexDirection: 'row',
          }}>
          <Image
            source={require('../assets/icons/game/wood.imageset/2.png')}
            style={{height: 100, width: 100, borderColor: 'black'}}></Image>
          <Image
            source={getImage(strike)}
            style={{
              position: 'absolute',
              left: 80,
              top: 14,
              height: 75,
              width: 25,
              borderColor: 'black',
            }}></Image>
          <View style={{left: 40}}>
            <View style={{flexDirection: 'row', flex: 1,  alignItems: 'center'}}>
              {randomWord.split('').map((i, j) => {
                if (i != ' ') {
                  return (
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: 'black',
                        marginRight: 2,
                      }}
                      key={j}>
                      {letters.includes(i) ? i.toUpperCase() : '●'}
                    </Text>
                  );
                } else {
                  return (
                    <Text style={{fontSize: 18, fontWeight: 'bold'}} key={j}>
                      {'  '}
                    </Text>
                  );
                }
              })}
            </View>
          </View>
        </View>
        <Text
          style={{
            marginLeft: 50,
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 15,
            color: 'black',
          }}>
          SCORE: {score}
        </Text>
        <View style={{alignItems: 'center'}}>
          <FlatList
            data={alphabet1}
            renderItem={({item}) => (
              <TouchableOpacity
                style={{
                  backgroundColor: pressed.includes(item)
                    ? '#8c8c8c'
                    : '#3d3d3d',
                  height: 44,
                  width: 44,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 1,
                }}
                onPress={() => {
                  letterClick(item, alphabet1.indexOf(item), 1);
                }}>
                <Text style={{color: 'white', fontSize: 20}}>
                  {item.toUpperCase()}
                </Text>
              </TouchableOpacity>
            )}
            numColumns={7}
            keyExtractor={(item, index) => index}
          />
          <FlatList
            data={alphabet2}
            renderItem={({item}) => (
              <TouchableOpacity
                style={{
                  backgroundColor: pressed.includes(item)
                    ? '#8c8c8c'
                    : '#3d3d3d',
                  height: 44,
                  width: 44,
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 1,
                }}
                onPress={() => {
                  letterClick(item, alphabet2.indexOf(item), 2);
                }}
              >
                <Text style={{color: 'white', fontSize: 20}}>
                  {item.toUpperCase()}
                </Text>
              </TouchableOpacity>
            )}
            numColumns={5}
            keyExtractor={(item, index) => index}
          />
        </View>
      </View>

      <View>
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
    textAlign: 'center',
    fontSize: 35,
    fontWeight: 'bold',
    letterSpacing: -1.9,
    color: 'black',
  },
  button: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 5,
  },
  banner: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    height: AppLovinMAX.isTablet() ? 90 : 50,
    bottom: Platform.select({
      ios: '15%',
      android: '15%',
    }),
  },
});
