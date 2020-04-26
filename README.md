# lab3-reactnotes-tvergho
lab3-reactnotes-tvergho created by GitHub Classroom

Features an interactive noteboard built on React with two primary components: the AddNoteBar and Note components. All notes are editable using Markdown syntax. Uses FortAwesome icons, Bootstrap, the TextareaAutosize library, react-rnd for dragging and resizing, React Router for multiple boards, and Firebase for storing the notes in the cloud. One thing I could not implement was resizing the notes automatically to fit the text and/or image. 

<b>Extra credit:</b> resizable notes, z-index ordering (note comes to front when clicked or dragged), undo functionality, and multiple boards with a URL randomizer. Everything after the domain name in the URL is a unique identifier that corresponds to a particular board. Without an identifier, the app opens on the 'default' board. The "generate board" button allows the user to generate a board that either matches a custom name or a randomly generated one if left blank.