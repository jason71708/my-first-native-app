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
  GestureResponderEvent,
  StyleSheet,
  Alert,
} from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';

import {
  IconButton,
  Provider as PaperProvider,
  Snackbar,
} from 'react-native-paper';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

function getRandomInt(min = 0, max = 100) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const styles = StyleSheet.create({
  resetButton: {
    position: 'absolute',
    margin: 16,
    left: 0,
    bottom: 0,
  },
  copyButton: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  snackbar: {
    top: '-400%',
  },
});

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [H, setH] = React.useState(0);
  const [S, setS] = React.useState(50);
  const [L, setL] = React.useState(50);
  const pointerRef = React.useRef({ x: 0, y: 0 });
  const [openHint, setOpenHint] = React.useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const onToggleSnackBar = () => setOpenHint(!openHint);

  const onDismissSnackBar = () => setOpenHint(false);

  const randomH = React.useCallback(() => {
    setH(getRandomInt(0, 360));
  }, [setH]);

  const setSafeRangeS = (n: number) => {
    setS(Math.min(100, Math.max(n, 0)));
  };

  const setSafeRangeL = (n: number) => {
    setL(Math.min(100, Math.max(n, 0)));
  };

  const resetHSL = () => {
    setH(0);
    setS(50);
    setL(50);
  };

  const copyToClipboard = () => {
    Clipboard.setString(`hsl(${H}, ${S}%, ${L}%)`);
  };

  const singleTapGesture = React.useMemo(
    () => Gesture.Tap().maxDuration(250).onStart(randomH),
    [randomH],
  );

  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      setSafeRangeS((e.translationX - pointerRef.current.x) / 5 + S);
      setSafeRangeL((e.translationY - pointerRef.current.y) / 5 + L);
      pointerRef.current = {
        x: e.translationX,
        y: e.translationY,
      };
    })
    .onEnd(() => {
      pointerRef.current = {
        x: 0,
        y: 0,
      };
    });

  const composedGesture = Gesture.Race(singleTapGesture, panGesture);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <SafeAreaView style={backgroundStyle}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />
          <GestureDetector gesture={composedGesture}>
            <View
              style={{
                backgroundColor: `hsl(${H}, ${S}%, ${L}%)`,
                height: '100%',
              }}
            />
          </GestureDetector>
          <IconButton
            style={styles.resetButton}
            icon="backup-restore"
            size={40}
            iconColor="#fff"
            onPress={resetHSL}
          />
          <IconButton
            style={styles.copyButton}
            icon="content-copy"
            size={40}
            iconColor="#fff"
            onPress={() => {
              copyToClipboard();
              onToggleSnackBar();
            }}
          />
          <Snackbar
            visible={openHint}
            onDismiss={onDismissSnackBar}
            duration={2000}
            style={styles.snackbar}
            action={{
              label: 'OK',
            }}>
            Copy color success!
          </Snackbar>
        </SafeAreaView>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

export default App;
