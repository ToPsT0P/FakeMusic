import {RouterProvider} from "react-router-dom";
import {router} from "../router/router.tsx";
import styles from "./App.module.scss"
import CurrentTrack from "../entity/currentTrack/CurrentTrack.tsx";
import {useAudio} from "../entity/AudioProvider/AudioProvider.tsx";

function App() {

    const { currentTrack } = useAudio()
  return (
    <div className={styles.wrapper}>
        <RouterProvider router={router}/>

        <div className={styles.currentMusic}>
            {currentTrack
                ? <CurrentTrack/>
                : <></>
            }
        </div>
    </div>
  )
}

export default App
