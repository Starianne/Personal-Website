//build audio player here (just toggle on an off for music) and add sound effects to page selection

const Music = document.querySelector('.music');
const audio = document.querySelector('#audio')

Music.addEventListener("click", () => {
    const playing = Music.classList.contains("play")
    if (playing) {
        Music.classList.remove("play")
        audio.pause()

    } else {
        Music.classList.add("play")
        audio.play()
    }
})
