import React from 'react';
import m from './App.module.sass';

function App() {
  const [q, setQ] = React.useState('');
  const [results, setResults] = React.useState<any[]>([]);

  const search = async () => {
    const res = await fetch(`http://127.0.0.1:6100/api/search?q=${q}`);
    const data = await res.json();
    setResults(data);
  }

  return (
    <div className={m.App}>
      <div className={m.Search}>
        <input placeholder='Search' className={m.Input} value={q} onChange={(e) => setQ(e.target.value)} />
        <button className={m.Button} onClick={search}>Search</button>
      </div>
      <div className={m.Results}>
        {results.map((r, i) => (
          <a key={i} className={m.Result} href={`/movie/${r.href.replace("https://", "").replaceAll("/", "*")}`}>
            <img src={r.poster} alt="poster" className={m.Poster} />
            <p className={m.Title}>{r.title}</p>
          </a>
        ))
        }
      </div>
    </div>
  );
}

export default App;
