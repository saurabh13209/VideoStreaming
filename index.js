import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './src/Screens/SplashScreen';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
