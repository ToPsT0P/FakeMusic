import logo from "../../shared/logo.svg";
import styles from "./Navbar.module.scss";
import React, { FC, useEffect, useRef, useState } from "react";
import { LuMusic } from "react-icons/lu";
import { IoIosAddCircleOutline } from "react-icons/io";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import axios from "axios";

interface INavbarProps {
    setModalArtist?: (props: boolean) => void;
    randomMusic?: () => void;
    setTracks?: any;
}

const Navbar: FC<INavbarProps> = ({ setTracks, setModalArtist, randomMusic }) => {
    const [query, setQuery] = useState('');
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSearchMusic = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(async () => {
            if (newQuery) {
                const { data } = await axios.get(`http://localhost:5000/tracks/search?query=${newQuery}`);
                setTracks(data);
            } else {
                const { data } = await axios.get(`http://localhost:5000/tracks`);
                setTracks(data);
            }
        }, 350);
    };

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className={styles.wrapper__navbar}>
            <div className={styles.wrapper__navbar__leftSide}>
                <img className={styles.wrapper__navbar__leftSide__logo} src={logo} alt="Logo" />
            </div>
            <div className={styles.wrapper__navbar__rightSide}>
                <ul>
                    <Link className={styles.wrapper__navbar__rightSide__Link} to={"/"}>
                        <LuMusic />
                        <p>All Music</p>
                    </Link>
                    {setModalArtist && (
                        <li className={styles.wrapper__navbar__rightSide__Link} onClick={() => setModalArtist(true)}>
                            <IoIosAddCircleOutline />
                            <p>Add singer</p>
                        </li>
                    )}
                    {randomMusic && (
                        <li className={styles.wrapper__navbar__rightSide__Link} onClick={randomMusic}>
                            <GiPerspectiveDiceSixFacesRandom />
                            <p>Play Random</p>
                        </li>
                    )}
                    {setTracks && (
                        <div className={styles.wrapper__navbar__input}>
                            <CiSearch style={{height: "25px", width:"25px", paddingLeft: "5px"}} />
                            <input type="text" value={query} onChange={handleSearchMusic} />
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
