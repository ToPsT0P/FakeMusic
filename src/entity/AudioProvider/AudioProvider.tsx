import React, { createContext, useContext, useRef, useState } from "react";
import { tracksInterface } from "../../pages/mainPage/MainPage.tsx";

interface IAudioProvider {
    children: React.ReactNode;
}

interface AudioContextProps {
    currentTrack: string | null;
    audio: HTMLAudioElement | null;
    playTrack: (track: string) => void;
    pauseTrack: () => void;
    isPlaying: boolean;
    changingTrack: (data: tracksInterface) => void;
    track: tracksInterface | null;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

const AudioProvider: React.FC<IAudioProvider> = ({ children }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentTrack, setCurrentTrack] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [track, setTrack] = useState<tracksInterface | null>(null);
    const [currentTime, setCurrentTime] = useState<number>(0);

    const changingTrack = (data: tracksInterface) => {
        setTrack(data);
    };

    const playTrack = (trackUrl: string) => {
        if (currentTrack === trackUrl && audioRef.current) {
            audioRef.current.currentTime = currentTime;
            audioRef.current.play();
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            audioRef.current = new Audio(trackUrl);
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
        setCurrentTrack(trackUrl);
        setIsPlaying(true);

        audioRef.current?.addEventListener("timeupdate", () => {
            setCurrentTime(audioRef.current?.currentTime || 0);
        });
    };

    const pauseTrack = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setCurrentTime(audioRef.current.currentTime);
            setIsPlaying(false);
        }
    };

    return (
        <AudioContext.Provider value={{ track, audio: audioRef.current, changingTrack, currentTrack, playTrack, pauseTrack, isPlaying }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = (): AudioContextProps => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error("useAudio must be used within an AudioProvider");
    }
    return context;
};

export default AudioProvider;
