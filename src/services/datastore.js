import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyCjwepRuEcvVTnTO4Vq-5REilbzQkBaQXE',
  authDomain: 'firenotes-67674.firebaseapp.com',
  databaseURL: 'https://firenotes-67674.firebaseio.com',
  projectId: 'firenotes-67674',
  storageBucket: 'firenotes-67674.appspot.com',
  messagingSenderId: '965351626619',
  appId: '1:965351626619:web:3072dbd6b1be2ed34f4fde',
  measurementId: 'G-RC9H8T1LRQ',
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export function fetchNotes(callback) {
  firebase.database().ref('notes').on('value', (snapshot) => {
    callback(snapshot.val());
  });
}

export function addNote(note) {
  firebase.database().ref('notes').push(note);
}

export function deleteNote(id) {
  firebase.database().ref('notes').child(id).remove();
}

export function updateNote(id, note) {
  firebase.database().ref('notes').child(id).update(note);
}

export function updateZ(id, z) {
  firebase.database().ref('notes').child(id).update({ zIndex: z });
}

export function updateAllNotes(notes) {
  notes.entrySeq().forEach(([id, note]) => {
    firebase.database().ref('notes').child(id).update(note);
  });
  firebase.database().ref('notes').once('value', (snapshot) => {
    snapshot.forEach((child) => {
      if (!notes.has(child.key)) {
        firebase.database().ref('notes').child(child.key).remove();
      }
    });
  });
}
