nodecg.Replicant('nowPlaying').on('change', (song) => {
  setTimeout(() => {
    $('#songTitle').text(song.title);
    $('#songArtists').text(`by ${song.artists}`);
  }, 5000);
});