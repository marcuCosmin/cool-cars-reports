import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"

import { initializeApp } from "firebase/app"
//Ignoring the getReactNativePersistence import because there is a problem with firebase types
//@ts-ignore
import { getReactNativePersistence, initializeAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDrMO_TAeVvE3Qf9eZ3uO_ZFNcJt9pB2js",
  authDomain: "cool-cars-garage-114b6.firebaseapp.com",
  projectId: "cool-cars-garage-114b6",
  storageBucket: "cool-cars-garage-114b6.firebasestorage.app",
  messagingSenderId: "99494946860",
  appId: "1:99494946860:web:bee09382ce2fd3f6270989",
}

const firebaseApp = initializeApp(firebaseConfig)

export const firebaseAuth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
})
export const firestore = getFirestore(firebaseApp)
