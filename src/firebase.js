import firebase from 'firebase'

const config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "makeup-scheduler",
  storageBucket: "",
  messagingSenderId: ""
};
firebase.initializeApp(config);

export default firebase
export const db = firebase.database();
export const auth = firebase.auth();
export const func = firebase.functions();
