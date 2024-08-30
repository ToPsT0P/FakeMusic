import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
import "./absoluteStyles.scss"
import AudioProvider from "./entity/AudioProvider/AudioProvider.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <div className="absoluteWrapper">
        <AudioProvider>
            <App />
        </AudioProvider>
    </div>
)
