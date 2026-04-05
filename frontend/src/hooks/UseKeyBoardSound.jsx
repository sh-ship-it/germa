// \public\sound\keystroke1.mp3
const KeyStrokeSounds = [
    new Audio('/sound/keystroke2.mp3'),
    new Audio('/sound/keystroke1.mp3'),
    new Audio('/sound/keystroke3.mp3'),
    new Audio('/sound/keystroke4.mp3'),
]; 


function UseKeyBoardSound() {
    const playRandomSoundKeyStrokeSound = () => {
        const randomSound = KeyStrokeSounds[Math.floor(Math.random() * KeyStrokeSounds.length)];
        
        randomSound.currentTime=0; 

        randomSound.play().catch((error) => {
            console.error("Audio played failed:", error);
        });
    };

    return {playRandomSoundKeyStrokeSound}
}

export default UseKeyBoardSound;