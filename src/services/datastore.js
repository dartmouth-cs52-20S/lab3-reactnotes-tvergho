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

export function fetchNotes(boardId, callback) {
  if (!boardId) {
    firebase.database().ref('notes').child('default').on('value', (snapshot) => {
      callback(snapshot.val());
    });
  } else {
    firebase.database().ref('notes').child(boardId).on('value', (snapshot) => {
      callback(snapshot.val());
    });
  }
}

export function addNote(note, boardId, callback) {
  if (!boardId) {
    firebase.database().ref('notes').child('default').push(note)
      .then((snapshot) => {
        callback(snapshot.key);
      });
  } else {
    firebase.database().ref('notes').child(boardId).push(note)
      .then((snapshot) => {
        callback(snapshot.key);
      });
  }
}

export function deleteNote(id, boardId) {
  if (!boardId) {
    firebase.database().ref('notes').child('default').child(id)
      .remove();
  } else {
    firebase.database().ref('notes').child(boardId).child(id)
      .remove();
  }
}

export function updateNote(id, note, boardId, callback) {
  if (!boardId) {
    firebase.database().ref('notes').child('default').child(id)
      .update(note, () => callback());
  } else {
    firebase.database().ref('notes').child(boardId).child(id)
      .update(note, () => callback());
  }
}

export function updateZ(id, z, boardId) {
  if (!boardId) {
    firebase.database().ref('notes').child('default').child(id)
      .update({ zIndex: z });
  } else {
    firebase.database().ref('notes').child(boardId).child(id)
      .update({ zIndex: z });
  }
}

export function updateAllNotes(notes, boardId) {
  let b = boardId;
  if (!b) {
    b = 'default';
  }

  notes.entrySeq().forEach(([id, note]) => {
    firebase.database().ref('notes').child(b).child(id)
      .update(note);
  });
  firebase.database().ref('notes').child(b).once('value', (snapshot) => {
    snapshot.forEach((child) => {
      if (!notes.has(child.key)) {
        firebase.database().ref('notes').child(b).child(child.key)
          .remove();
      }
    });
  });
}
