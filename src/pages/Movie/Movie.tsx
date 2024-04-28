import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import m from './Movie.module.sass'
import ReactPlayer from 'react-player'

export default function Movie() {
	const { id } = useParams();
	const [video, setVideo] = React.useState<any>(null);

	useEffect(() => {
		async function getVideo() {
			const res = await fetch(`http://127.0.0.1:6100/api/film?url=https://${id?.replaceAll("*", "/")}`);
			
			if (res.status === 200) {
				const data = await res.json();
				setVideo(data);
			}
		}

		getVideo();
	}, []);

  return (
    <div className={m.Movie}>
			{video ? (
				<>
					<h1>{video.title}</h1>
					<ReactPlayer url={video.url} controls={true} />
				</>
			) : (
				<p>Loading...</p>
			)}
		</div>
  )
}
