import styles from "./Track.module.scss";
import { tracksInterface } from "../../pages/mainPage/MainPage.tsx";
import React, {useEffect, useState} from "react";
import {FaCirclePause, FaCirclePlay, FaTrash} from "react-icons/fa6";
import { useAudio } from "../../entity/AudioProvider/AudioProvider";
import axios from "axios";
import {Link} from "react-router-dom";

interface TrackProps {
    track: tracksInterface;
    setText: (props: string) => void
    index?: number;
    flag?: boolean;
    setFlag?: (props: boolean) => void;
    setRandomIndex?: (props: null) => void;
    randomMusicUse?: boolean;
    randomIndex?: number | null
}

const Track: React.FC<TrackProps> = ({
                                         setText,
                                         track ,
                                         index,
                                         setFlag,
                                         flag,
                                         randomMusicUse,
                                         setRandomIndex,
                                         randomIndex}) => {

    const { currentTrack, playTrack, pauseTrack, isPlaying, changingTrack } = useAudio();
    const audioUrl = `http://localhost:5000/static/${track.audio}`;
    const isCurrentTrackPlaying = isPlaying && currentTrack === audioUrl;
    const [correctTime, setCorrectTime] = useState<string>("0:00")


    useEffect(() => {
        const randomAudioFunc = async () => {
            if(randomIndex !== null){
                if(randomIndex -1 === index && !isCurrentTrackPlaying) {
                    changingTrack(track)
                    playTrack(audioUrl)
                    setRandomIndex(null)
                }
            }

        }
        randomAudioFunc()

    }, [randomMusicUse]);

    const handlePlayPause = () => {
        if (isCurrentTrackPlaying) {
            pauseTrack();
        } else {
            changingTrack(track);
            playTrack(audioUrl);
        }
    };

    const deleteAudio = async () => {
        await axios.delete(`http://localhost:5000/tracks/${track._id}`, {})
        setFlag(!flag)
    }

    useEffect(() => {
        if (track.duration && !isNaN(track.duration)) {
            const minutes = Math.floor(track.duration / 60);
            const seconds = Math.ceil(track.duration % 60);
            setCorrectTime(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
        } else {
            setCorrectTime("0:00");
        }
    }, [track.duration]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.wrapper__leftSide}>
                <p style={{color:"#777", width: "20px", minWidth:"20px"}}>{index + 1}</p>
                {isCurrentTrackPlaying ? (
                    <FaCirclePause onClick={handlePlayPause} style={{ color: '#fff' }} className={styles.icon} />
                ) : (
                    <FaCirclePlay onClick={handlePlayPause} style={{ color: '#fff' }} className={styles.icon} />
                )}
                <p onClick={() => {setText(track.text)}} className={styles.wrapper__musicName}>{track.name}</p>
            </div>
            <div className={styles.wrapper__centerSide}>
                <Link to={`/singer/${track.artist}`} className={styles.wrapper__musicName}>{track.artist}</Link>
            </div>
            <div className={styles.wrapper__rightSide}>
                <FaTrash onClick={() => {deleteAudio()}} style={{ color: '#fff' }} className={styles.iconTrash}/>
                <p className={styles.wrapper__musicName__time}>{correctTime}</p>
            </div>
        </div>
    );
};

export default Track;
