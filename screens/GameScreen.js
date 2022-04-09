import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ImageBackground, FlatList, TouchableOpacity, Image, TextInput,Pressable } from 'react-native';
import words from '../data.json';
import AppLovinMAX from "react-native-applovin-max";
import StatsScreen from './StatsScreen';

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
}

export default function GameScreen({ navigation, route }) {
    const data = route.params;
    const [randomWord, setrandomWord] = useState('');
    const [letters, setLetters] = useState('');
    const [score, setScore] = useState(-1);
    const [count, setCount] = useState(0);
    const [strike, setStrike] = useState(0);
    let wordArray = words[data.item];
    const category = data.item;
    const alphabet1 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u'];
    const alphabet2 = ['v', 'w', 'x', 'y', 'z'];

    const mybanner = Platform.select({
        android: '3a8e976be157ff64',
    });

    const myinterstitial = Platform.select({
        android: 'c610fb63a0e41e0c',
    });
    
    const [retryAttempt, setRetryAttempt] = useState(0);

    const navigateMe = () => {
        navigation.navigate("StatsScreen", { category: randomWord, score: score });
    };

    useEffect(() => {
        let myWord = wordArray[(Math.floor(Math.random() * wordArray.length))];
        setrandomWord(myWord);
        if(score%2 == 0){
            initializeInterstitialAds();
            if (AppLovinMAX.isInterstitialReady(myinterstitial)) {
                AppLovinMAX.showInterstitial(myinterstitial);
            }
            else{
                console.log("haris this some bullshit");
            }
        }
    }, [score]);

    useEffect(() => {
        if (strike == 6) {
            console.log("GAME OVER");
            navigateMe();
        }
    }, [strike]);

    useEffect(() => {
        if (randomWord.length == count) {
            console.log("Termination Count", count);
            console.log("Termination Letters", letters)
            setCount(0);
            setStrike(0);
            setScore(score + 1);
            setLetters('');
        }
    }, [count])


    const letterClick = (item) => {
        if (randomWord.includes(item)) {
            if (!(letters.includes(item))) {
                console.log("The count: ", count);
                let increment = randomWord.split(item).length - 1;
                console.log("The increment ", increment);
                console.log("The space ", randomWord.split(" ").length - 1);
                count == 0 ? increment += (randomWord.split(" ").length - 1) : "";
                setCount(count + increment);
                setLetters(letters + item);
            }
        } else {
            setStrike(strike + 1);
        }
    }
    
    function initializeInterstitialAds()
    {
        AppLovinMAX.addEventListener('OnInterstitialLoadedEvent', () => {
            // Interstitial ad is ready to be shown. AppLovinMAX.isInterstitialReady(INTERSTITIAL_AD_UNIT_ID) will now return 'true'
    
            // Reset retry attempt
            setRetryAttempt(0)
        });
        AppLovinMAX.addEventListener('OnInterstitialLoadFailedEvent', () => {
            // Interstitial ad failed to load 
            // We recommend retrying with exponentially higher delays up to a maximum delay (in this case 64 seconds)
            
            setRetryAttempt(retryAttempt + 1);
            var retryDelay = Math.pow(2, Math.min(6, retryAttempt));
    
            console.log('Interstitial ad failed to load - retrying in ' + retryDelay + 's');
              
            setTimeout(function() {
                loadInterstitial();
            }, retryDelay * 1000);
        });
        AppLovinMAX.addEventListener('OnInterstitialClickedEvent', () => { });
        AppLovinMAX.addEventListener('OnInterstitialDisplayedEvent', () => { });
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
    
    function loadInterstitial()
    {
        AppLovinMAX.loadInterstitial(myinterstitial);
    }

    return (
        <ImageBackground style={{ flex: 1 }} source={require('../assets/background.png')}>
            <View style={{ flexDirection: 'row', marginTop: 50, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={{ position: 'absolute', left: 5 }}
                    onPress={() => navigation.navigate("HomeScreen")}
                ><Image source={require('../assets/backButt.imageset/back.png')}></Image>
                </TouchableOpacity>
                <Text style={styles.header}>{category.toUpperCase()}</Text>
            </View>
            <View style={{ marginLeft: 20, marginTop: 30, position: "relative", height: 120, flexDirection: "row" }}>
                <Image source={require('../assets/icons/game/wood.imageset/2.png')} style={{ height: 100, width: 100, borderColor: "black" }}></Image>
                <Image source={getImage(strike)} style={{ position: "absolute", left: 80, top: 14, height: 75, width: 25, borderColor: "black" }}></Image>
                <View style={{ left: 40 }}>
                    <TextInput style={{ fontSize: 10, fontWeight: "bold",color:'black' }}>{randomWord.toUpperCase()}</TextInput>
                    <View style={{ flex: 1, flexDirection: "row" }}>
                        {
                            randomWord.split('').map((i, j) => {
                                if (i != " ") {
                                    return (
                                        <TextInput style={{ fontSize: 18, fontWeight: "bold",color:'black' }} key={j}>
                                            {letters.includes(i) ? i.toUpperCase() : '●'}
                                        </TextInput>
                                    )
                                }
                                else {
                                    return (
                                        <TextInput style={{ fontSize: 18, fontWeight: "bold" }} key={j}>
                                            {" "}
                                        </TextInput>
                                    )
                                }
                            })}
                    </View>
                </View>
            </View>
            <Text style={{ marginLeft: 50, fontSize: 18, fontWeight: 'bold',marginBottom:15,color:'black' }}>SCORE: {score}</Text>
            <View style={{ alignItems: 'center',marginBottom:"105%" }}>
                <FlatList
                    data={alphabet1}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#3d3d3d",
                                height: 44,
                                width: 44,
                                borderRadius: 50,
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: 1
                            }}
                            onPress={() => { letterClick(item, alphabet1.indexOf(item), 1) }}
                        >
                            <Text style={{ color: "white", fontSize: 20 }}>{item.toUpperCase()}</Text>
                        </TouchableOpacity>
                    )}
                    numColumns={7}
                    keyExtractor={(item, index) => index}
                />
                <FlatList
                    data={alphabet2}
                    renderItem={({ item }) => (
                        <Pressable
                            style={{
                                backgroundColor: "#3d3d3d",
                                height: 44,
                                width: 44,
                                borderRadius: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: 1
                            }}
                            onPress={() => { letterClick(item, alphabet2.indexOf(item), 2) }}
                        // disabled={disable2[alphabet2.indexOf(item)]}

                        >
                            <Text style={{ color: "white", fontSize: 20 }}>{item.toUpperCase()}</Text>
                        </Pressable>
                    )}
                    numColumns={5}
                    keyExtractor={(item, index) => index}
                />
            </View>
            {/* <TouchableOpacity
                            style={{
                                backgroundColor: "#3d3d3d",
                                height: 44,
                                width: 44,
                                borderRadius: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: 1
                            }}
                            onPress={() => { myfun()}}
                        // disabled={disable2[alphabet2.indexOf(item)]}

                        >
                            <Text style={{ color: "white", fontSize: 20 }}>ad button</Text>
                        </TouchableOpacity> */}
            <View style={{justifyContent:"center",alignItems:"center"}}> 
                <AppLovinMAX.AdView adUnitId={mybanner} adFormat={AppLovinMAX.AdFormat.BANNER} style={styles.banner}/>
            </View>
        </ImageBackground >
    );
}

const styles = StyleSheet.create({
    header: {
        textAlign: 'center',
        fontSize: 35,
        fontWeight: 'bold',
        letterSpacing: -1.9,
        color:'black'
    },
    button: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 5
    },
    banner: {
        borderRadius:25,
        height: AppLovinMAX.isTablet() ? 90 : 50,
        bottom:  Platform.select({
          ios: 36, 
          android: 36,
        })
    }
});