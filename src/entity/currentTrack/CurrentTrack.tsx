import styles from "./CurrentTrack.module.scss"
import {useAudio} from "../AudioProvider/AudioProvider.tsx";
import {FaPause, FaPlay} from "react-icons/fa";
import {AiFillSound} from "react-icons/ai";
import {useEffect, useState} from "react";


const CurrentTrack = () => {

    const {audio, track, playTrack, pauseTrack, isPlaying } = useAudio()
    const audioUrl = `http://localhost:5000/static/${track.audio}`;
    const [duration, setDuration] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState(0);

    const handlePlayPause = () => {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack(audioUrl);
        }
    };

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const trackAudio = audio;
        if (trackAudio) {
            const newTime = Number(event.target.value);
            audio.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };


    useEffect(() => {
        const trackAudio = audio;
        if (audio) {
            const updateTime = () => {
                setCurrentTime(trackAudio.currentTime);
                setDuration(trackAudio.duration);
            };

            audio.addEventListener("timeupdate", updateTime);
            audio.addEventListener("loadedmetadata", updateTime);

            return () => {
                audio.removeEventListener("timeupdate", updateTime);
                audio.removeEventListener("loadedmetadata", updateTime);
            };
        }
    }, [track]);

    return (
        <div className={styles.wrapper}>
                <input className={styles.wrapper__soundTrack}
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleTimeChange}
                />
            <div className={styles.wrapper__mainSide}>
                <div className={styles.wrapper__mainSide__leftSide}>
                    {isPlaying
                    ? <FaPause className={styles.wrapper__buttons} onClick={() => {handlePlayPause()}}/>
                    : <FaPlay className={styles.wrapper__buttons}  onClick={() => {handlePlayPause()}} />
                    }
                    <img src={`http://localhost:5000/static/${track?.picture}`} alt=""/>
                    <div className={styles.wrapper__mainSide__leftSide__name}>
                        <p>{track?.name}</p>
                        <p>{track?.artist}</p>
                    </div>
                </div>
                <div className={styles.wrapper__mainSide__rightSide}>
                    <AiFillSound className={styles.wrapper__buttons}/>
                </div>
            </div>
        </div>
    );
};

export default CurrentTrack;