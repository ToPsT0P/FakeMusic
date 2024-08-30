import styles from "./SongPage.module.scss"
import { useEffect, useState } from "react";
import axios from "axios";
import { tracksInterface } from "../mainPage/MainPage.tsx";
import Navbar from "../../widgets/navbar/Navbar.tsx";
import Track from "../../entity/tracks/Track.tsx";
import ModalAddSong from "../../widgets/modalAddSong/ModalAddSong.tsx";

const SingerPage = () => {
    const [tracks, setTracks] = useState<tracksInterface[] | null>(null);
    const [artistData, setArtistData] = useState<any | null>(null);
    const [modal, setModal] = useState<boolean>(false)
    const [text, setText] = useState<string>("")

    const url = new URL(window.location.href);
    const pathSegments = url.pathname.split("/");
    const lastSegment = pathSegments.pop();
    let artistName: string = "";

    if (lastSegment) {
        artistName = decodeURIComponent(lastSegment);
    } else {
        console.error("Artist name is undefined");
    }

    useEffect(() => {
        const fetchingMusic = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/artists/songs/${artistName}`);
                setTracks(data);
            } catch (error) {
                console.error("Error fetching music:", error);
            }
        };
        const fetchingDataArtist = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/artists/search/${artistName}`);
                setArtistData(data);
            } catch (error) {
                console.error("Error fetching artist data:", error);
            }
        };
        fetchingDataArtist();
        fetchingMusic();
    }, [artistName, modal]);


    return (
        <div className={styles.absoluteWrapper}>
            {modal && <ModalAddSong setModalMusic={setModal} artistName={artistName}/>}
            <Navbar />
            {artistData ?
                <div className={styles.wrapper}>
                    <div className={styles.wrapper__wrap}>
                        <div className={styles.wrapper__leftSide}>
                            <div className={styles.wrapper__leftSide__avatar}>
                                <img src={`http://localhost:5000/static/${artistData?.picture}`}
                                     className={styles.wrapper__leftSide__avatar__image}/>
                                <button onClick={() => {
                                    setModal(true)
                                }}>Add track
                                </button>
                            </div>
                            <div className={styles.wrapper__leftSide__biography}>
                                <p>{artistData?.biography}</p>
                            </div>
                        </div>
                        <div className={styles.wrapper__rightSide}>
                            <div className={styles.wrapper__rightSide__music}>
                                {tracks && tracks.map((track, i) => (
                                    <Track setText={setText} index={i} track={track} key={i}/>))}
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapper__rightSide__text}>
                        {text ? <p>{text}</p> :
                            <p style={{color: "white", marginLeft: "20px"}}>Sorry, there are no lyrics for this
                                track</p>}
                    </div>
                </div>

                :
                <div style={{color: "white", display: "flex", justifySelf: "center"}}>Sorry, there was some kind of
                    error.</div>
            }
        </div>
    );
};

export default SingerPage;
