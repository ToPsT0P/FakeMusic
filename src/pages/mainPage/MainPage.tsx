import styles from "./MainPage.module.scss";
import Navbar from "../../widgets/navbar/Navbar";
import Track from "../../entity/tracks/Track";
import { useEffect, useState } from "react";
import axios from "axios";
import ModalAddArtist from "../../widgets/modalAddArtist/ModalAddSinger.tsx";

export interface tracksInterface {
    name: string;
    _id: string;
    picture: string;
    audio: string;
    artist: string;
    text: string;
    listens: number;
    duration: number;
}

const MainPage = () => {
    const url = "http://localhost:5000";

    const [modalArtist, setModalArtist] = useState<boolean>(false)
    const [tracks, setTracks] = useState([]);
    const [count, setCount] =useState<number>(40)
    const [flag, setFlag] = useState<boolean>(false)
    const [randomMusicUse, setRandomMusicUse] = useState<boolean>(false)
    const [randomIndex, setRandomIndex] = useState<number | null>(0)
    const [text, setText] = useState<string>("")

    const randomMusic = () => {
        setInterval(() => {
            setRandomMusicUse(!randomMusicUse);
        }, 100)
        setRandomIndex(Math.floor(Math.random() * (tracks.length - 1 + 1) + 1))

    }


    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const response = await axios.get(`${url}/tracks/?count=${count}`);
                setTracks(response.data);
            } catch (error) {
                console.error("Error fetching tracks:", error);
            }
        };

        fetchTracks();
    }, [modalArtist, flag]);

    return (
        <div className={styles.wrapper}>
            {modalArtist
                ? <ModalAddArtist setModalArtist={setModalArtist}/>
                :  <></>
            }
            <Navbar setTracks={setTracks} randomMusic={randomMusic} setModalArtist={setModalArtist}/>
            <div className={styles.wrapper__mainSection}>
                <div className={styles.wrapper__mainSection__tracks}>
                    {tracks.length > 0 ? (
                        tracks.map((track: tracksInterface, index) => (
                            <Track
                                setText={setText}
                                index={index}
                                key={index}
                                flag={flag}
                                setFlag={setFlag}
                                randomMusicUse={randomMusicUse}
                                randomIndex={randomIndex}
                                track={track}
                                setRandomIndex={setRandomIndex}/>
                        ))
                    ) : (
                        <p style={{color: "white", justifySelf:"center"}}>No tracks available</p>
                    )}
                </div>
                <div className={styles.wrapper__mainSection__text}>
                    {text ? <p>{text}</p>
                    : <p>Sorry, there are no lyrics for this track</p>}
                </div>
            </div>
        </div>

    );
};

export default MainPage;
