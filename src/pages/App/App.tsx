import React from 'react';
import m from './App.module.sass';
import ReactPlayer from 'react-player';

function App() {
  const [q, setQ] = React.useState('');
  const [results, setResults] = React.useState<any[]>([]);
  const [video, setVideo] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [videoLoading, setVideoLoading] = React.useState(false);

  const search = async () => {
    setLoading(true);

    const res = await fetch(`http://127.0.0.1:6100/api/search?q=${q}`);
    const data = await res.json();
    setResults(data);
    setVideo(null);

    setLoading(false);
  }

  // Handle enter key press
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        search();
      }
    }

    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    }
  }, [q]);

  const fetchVideo = async (href: string) => {
    // open a new tab with the url
    window.open(href, '_blank');
    // setVideoLoading(true);

    // const res = await fetch(`http://127.0.0.1:6100/api/film?url=${href}`);

    // if (res.status === 200) {
    //   const data = await res.json();
    //   setVideo(data);
    // }

    // setVideoLoading(false);
  }
  return (
    <div className={m.App}>
      <div className={m.Search}>
        <input placeholder='Search' className={m.Input} value={q} onChange={(e) => setQ(e.target.value)} />
        <button className={m.Button} onClick={search}>Search</button>
      </div>
      {loading && <p>Loading...</p>}
      {videoLoading && <p>Loading video...</p>}
      {video ? <div className={m.Video}>
        <ReactPlayer width={"80vw"} height={"60vh"} url={video.url} controls={true} />
      </div> :
        <div className={m.Results}>
          {results.map((r, i) => (
            <button onClick={async () => await fetchVideo(r.href)} key={i} className={m.Result}>
              <img src={r.poster} alt="poster" className={m.Poster} />
              <p className={m.Title}>{r.title}</p>
            </button>
          ))
          }
        </div>}
    </div>
  );
}

export default App;
