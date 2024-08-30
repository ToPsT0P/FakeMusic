import styles from "./ModalAddSong.module.scss";
import React, { FC, useState, ChangeEvent, FormEvent } from "react";
import { CiImageOn, CiMusicNote1 } from "react-icons/ci";
import axios from "axios";

interface IModalAddSong {
    setModalMusic: (props: boolean) => void;
    artistName: string;
}

const ModalAddSong: FC<IModalAddSong> = ({ setModalMusic, artistName }) => {
    const [pageAddSong, setPageAddSong] = useState<null | number>(0);
    const [songName, setSongName] = useState<string>("");
    const [songText, setSongText] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [songFile, setSongFile] = useState<File | null>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (name === "songName") setSongName(value);
        if (name === "imageLink" && files) setImageFile(files[0]);
        if (name === "songLink" && files) setSongFile(files[0]);
        if (name === "songText") setSongText(value);
    };

    const finalStageFunc = async () => {
        setPageAddSong(3);

        const formData = new FormData();
        formData.append("name", songName);
        formData.append("artist", artistName);
        if (imageFile) formData.append("picture", imageFile);
        if (songFile) formData.append("audio", songFile);
        formData.append("text", songText);

        await axios.post("http://localhost:5000/tracks", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const checkFirstData = (e: FormEvent) => {
        e.preventDefault();
        if ( songName && imageFile && songFile) {
            setPageAddSong(1);
        } else {
            alert("Пожалуйста, заполните все поля!");
        }
    };

    return (
        <div className={styles.background} onClick={() => setModalMusic(false)}>
            <div className={styles.wrapper} onClick={(e) => e.stopPropagation()}>
                {pageAddSong === 0 && (
                    <form onSubmit={checkFirstData} className={styles.wrapper__inputs}>
                        <h2>Загрузите новую песню!</h2>
                        <input
                            required
                            placeholder="Название песни"
                            type="text"
                            name="songName"
                            value={songName}
                            onChange={handleInputChange}
                        />
                        <div className={styles.wrapper__downloadButtons}>
                            <div className={styles.wrapper__downloadButtons__picture}>
                                <div>
                                    <CiImageOn className={styles.wrapper__downloadButtons__picture__img} />
                                    <p>Загрузите картинку для вашей песни</p>
                                </div>
                                <input
                                    required
                                    type="file"
                                    name="imageLink"
                                    onChange={handleInputChange}
                                    accept="image/*"
                                />
                            </div>
                            <div className={styles.wrapper__downloadButtons__rightSide}>
                                <div className={styles.wrapper__downloadButtons__rightSide__song}>
                                    <div>
                                        <CiMusicNote1 className={styles.wrapper__downloadButtons__rightSide__img} />
                                        <p>Загрузите саму песню (mp3/mp4 Формата)</p>
                                    </div>
                                    <input
                                        required
                                        type="file"
                                        name="songLink"
                                        onChange={handleInputChange}
                                        accept=".mp3,.mp4"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={styles.wrapper__downloadButtons__rightSide__continue}
                                >
                                    Продолжить
                                </button>
                            </div>
                        </div>
                    </form>
                )}
                {pageAddSong === 1 && (
                    <div className={styles.wrapper__text}>
                        <h3>Вы хотите добавить текст?</h3>
                        <button onClick={() => finalStageFunc()}>Нет</button>
                        <button onClick={() => setPageAddSong(2)}>Да</button>
                    </div>
                )}
                {pageAddSong === 2 && (
                    <div className={styles.wrapper__textSong}>
                        <h3>Введите текст</h3>
                        <textarea
                            onChange={(e) => setSongText(e.target.value)}
                            name="songText"
                            required={true}
                            value={songText}
                        />
                        <button onClick={() => finalStageFunc()}>Добавить</button>
                    </div>
                )}
                {pageAddSong === 3 && (
                    <div className={styles.wrapper__final}>
                        <h3>Песня успешно добавлена</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModalAddSong;

