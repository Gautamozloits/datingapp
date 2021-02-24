/**
 * Local Server: http://192.168.1.4
 * Dev server: http://37.44.244.212
 * Prod server: http://15.206.133.239
 */
var URL = "http://37.44.244.212";
var PORT = ":5000";
var ROOT_FOLDER = "/nodeV2/"; //local

// var URL = "http://37.44.244.212";
// var PORT = ":3000"; //zeeweesoft local
// var ROOT_FOLDER = "/zeeweesoft/node/"; //zeeweesoft local

// var URL = "http://thehomegame.in";
// var PORT = ":8000";
// var ROOT_FOLDER = "/node/"; //local

module.exports = {
  SOCKET_URL: URL + PORT,
  API_ENDPOINT: URL + PORT + "/api/",
  UPLOAD_URL: URL + ROOT_FOLDER + "public/uploads/",
  ROOT_PATH: URL + ROOT_FOLDER,

  CURRENCY: "Rs",
  DATE_FORMAT: "DD MMM, YYYY",
  SERVER_DATE_FORMAT: "YYYY-MM-DD",
  GameUsers: [
    {
      id: Math.random(),
      name: "",
      nickname: "",
      phone_number: "",
      isVisible: false,
    },
  ],
  FIREBASE_CONFIG: {
    apiKey: "AIzaSyD1lk-Eg6LunIpMVGL_feoNcACFwukDpVE",
    authDomain: "homegameapp.com",
    databaseURL: "https://home-game-273112.firebaseio.com",
    projectId: "home-game-273112",
    storageBucket: "home-game-273112.appspot.com",
    messagingSenderId: "947645481156",
    appId: "1:947645481156:android:61bc661e7ea988c606c991",
    measurementId: "G-measurement-id",
  },
  THIS_SOCKET: null,
  IS_SOCKET_CONNECTED: false,
  CLOCK_INTERVAL_ID: false,
  LOCALSTORAGE: "_prod", //develpment
  ACTIVE_GAME_IMAGE: require("../assets/images/blackjack.png"),
  expoToken:"expotoken",
  APP_VERSION: '4.0.0',
  CURRENCY_ICON: require("../assets/images/coin_yellow.png")
};
