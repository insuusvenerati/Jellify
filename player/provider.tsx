import { createContext, ReactNode, SetStateAction, useContext, useState } from "react";
import { JellifyTrack } from "../types/JellifyTrack";
import { storage } from "../constants/storage";
import { MMKVStorageKeys } from "../enums/mmkv-storage-keys";
import { useActiveTrack, useProgress } from "react-native-track-player";
import { findPlayQueueIndexStart } from "./mutators/helpers";
import { add, remove, removeUpcomingTracks } from "react-native-track-player/lib/src/trackPlayer";
import _ from "lodash";

interface PlayerContext {
    showPlayer: boolean;
    setShowPlayer: React.Dispatch<SetStateAction<boolean>>;
    showMiniplayer: boolean;
    setShowMiniplayer: React.Dispatch<SetStateAction<boolean>>;
    queue: JellifyTrack[];
    clearQueue: () => Promise<void>;
    addToQueue: (tracks: JellifyTrack[]) => Promise<void>;
    activeTrack: JellifyTrack | undefined;
    setPlayerState: React.Dispatch<SetStateAction<null>>;
    position: number;
    buffered: number;
    duration: number;
}

const PlayerContextInitializer = () => {

    const queueJson = storage.getString(MMKVStorageKeys.PlayQueue);
    
    const [showPlayer, setShowPlayer] = useState<boolean>(false);
    const [showMiniplayer, setShowMiniplayer] = useState<boolean>(false);
    const [queue, setQueue] = useState<JellifyTrack[]>(queueJson ? JSON.parse(queueJson) : []);

    //#region RNTP Setup
    const [playerState, setPlayerState] = useState(null);
    const { position, buffered, duration } = useProgress()

    let activeTrack = useActiveTrack() as JellifyTrack | undefined;
    //#endregion RNTP Setup

    const clearQueue = async () => {
        await removeUpcomingTracks();
        await remove(0)
        setQueue([]);
    }

    const addToQueue = async (tracks: JellifyTrack[]) => {
        let insertIndex = findPlayQueueIndexStart(queue);

        await add(tracks, insertIndex);

        let newQueue : JellifyTrack[] = [];
        tracks.forEach(track => {
            newQueue = _.cloneDeep(queue).splice(insertIndex, 0, track);
        });

        setQueue(newQueue)
    }

    return {
        showPlayer,
        setShowPlayer,
        showMiniplayer,
        setShowMiniplayer,
        queue,
        addToQueue,
        clearQueue,
        activeTrack,
        setPlayerState,
        position,
        buffered,
        duration,
    }
}

export const PlayerContext = createContext<PlayerContext>({
    showPlayer: false,
    setShowPlayer: () => {},
    showMiniplayer: false,
    setShowMiniplayer: () => {},
    queue: [],
    clearQueue: async () => {},
    addToQueue: async ([]) => {},
    activeTrack: undefined,
    setPlayerState: () => {},
    position: 0,
    buffered: 0,
    duration: 0
});

export const PlayerProvider: ({ children }: { children: ReactNode }) => React.JSX.Element = ({ children }: { children: ReactNode }) => {
    const { 
        showPlayer, 
        setShowPlayer, 
        showMiniplayer, 
        setShowMiniplayer, 
        queue, 
        clearQueue,
        addToQueue,
        activeTrack,
        setPlayerState,
        position,
        buffered,
        duration
    } = PlayerContextInitializer();

    return <PlayerContext.Provider value={{
        showPlayer,
        setShowPlayer,
        showMiniplayer,
        setShowMiniplayer,
        queue,
        clearQueue,
        addToQueue,
        activeTrack,
        setPlayerState,
        position,
        buffered,
        duration
    }}>
        { children }
    </PlayerContext.Provider>
}

export const usePlayerContext = () => useContext(PlayerContext);