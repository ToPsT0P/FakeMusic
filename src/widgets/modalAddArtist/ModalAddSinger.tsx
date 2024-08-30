import styles from "./ModalAddSinger.module.scss"
import { FC, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { AiFillFileImage } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

interface IModalAddArtist {
    setModalArtist: (props: boolean) => void;
}

const ModalAddArtist: FC<IModalAddArtist> = ({ setModalArtist }) => {
    const [artistName, setArtistName] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [artistBiography, setArtistBiography] = useState<string>("")
    const navigate = useNavigate();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (name === "artist") setArtistName(value);
        if (name === "artistBiography") setArtistBiography(value)
        if (name === "imageLink" && files) setImageFile(files[0]);
    };

    const createArtist = async () => {

        const formData = new FormData();
        formData.append("name", artistName);
        formData.append("biography", artistBiography)
        if (imageFile) formData.append("picture", imageFile);

        await axios.post("http://localhost:5000/artists", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(function (response) {
                navigate(`/singer/${artistName}`);
            })
            .catch(function (error) {
                alert("Артист уже существует")
            });
    };

    const checkFirstData = (e: FormEvent) => {
        e.preventDefault();
        if (artistName && imageFile && artistBiography) {

        } else {
            alert("Please fill in all fields!");
        }
    };

    return (
        <div className={styles.background} onClick={() => setModalArtist(false)}>
            <div className={styles.wrapper} onClick={(e) => e.stopPropagation()}>

                        <h2>Create new artist!</h2>
                        <form onSubmit={checkFirstData} className={styles.wrapper__input}>
                            <input
                                required
                                className={styles.wrapper__input__artistName}
                                placeholder="Artist name"
                                type="text"
                                name="artist"
                                value={artistName}
                                onChange={handleInputChange}
                            />
                            <input
                                required
                                className={styles.wrapper__input__artistName}
                                placeholder="Artist biography"
                                type="text"
                                name="artistBiography"
                                value={artistBiography}
                                onChange={handleInputChange}
                            />
                            <div className={styles.wrapper__input__imageDownload}>
                                <div className={styles.wrapper__input__imageDownload__image}>
                                    <AiFillFileImage className={styles.wrapper__input__imageDownload__image__icon}/>
                                    <p>load artist image</p>
                                    <input
                                        required
                                        type="file"
                                        name="imageLink"
                                        onChange={handleInputChange}
                                        accept="image/*"
                                    />
                                </div>

                                <div className={styles.wrapper__input__continueButton}>
                                    <button
                                        onClick={() => createArtist()}
                                        type="submit"
                                    >
                                        Create
                                    </button>
                                </div>
                            </div>
                        </form>
            </div>
        </div>
    );
};

export default ModalAddArtist;
