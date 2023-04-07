/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
  View,
  Pressable,
  GestureResponderEvent,
  StyleSheet,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

function getRandomInt(min = 0, max = 100) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [H, setH] = React.useState(1);
  const [S, setS] = React.useState(50);
  const [L, setL] = React.useState(50);
  const [opacity, setOpacity] = React.useState(1);
  const pointerRef = React.useRef({ x: 0, y: 0 });

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const randomH = () => {
    setH(getRandomInt(1, 360));
  };

  const randomS = () => {
    setS(getRandomInt(0, 100));
  };

  const randomL = () => {
    setL(getRandomInt(0, 100));
  };

  const randomOpacity = () => {
    setOpacity(Number(Math.random().toFixed(1)));
  };

  const storePointerPosition = (evt: GestureResponderEvent) => {
    pointerRef.current = {
      x: evt.nativeEvent.pageX,
      y: evt.nativeEvent.pageY,
    };
  };

  const triggerEvent = (evt: GestureResponderEvent) => {
    const deltaX = Math.abs(evt.nativeEvent.pageX - pointerRef.current.x);
    const deltaY = Math.abs(evt.nativeEvent.pageY - pointerRef.current.y);
    if (deltaX < 5 && deltaY < 5) {
      randomH();
    } else if (deltaX < 5 && deltaY > 5) {
      randomS();
    } else if (deltaX > 5 && deltaY < 5) {
      randomL();
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View>
        <View
          style={{
            backgroundColor: `hsla(${H}, ${S}%, ${L}%, ${opacity})`,
            height: '100%',
          }}
          onStartShouldSetResponder={evt => {
            storePointerPosition(evt);
            return true;
          }}
          onResponderRelease={triggerEvent}>
          <Pressable style={styles.button} onPress={randomOpacity}>
            <Text>123</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default App;
