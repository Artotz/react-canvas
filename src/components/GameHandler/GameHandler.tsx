import { useCallback, useState, useEffect, ChangeEvent } from "react"
import DesktopInterface from "../DesktopInterface/DesktopInterface";

export function useLocalStorage(key: any, defaultValue: any) {
    return useStorage(key, defaultValue, window.localStorage)
}

export function useSessionStorage(key: any, defaultValue: any) {
    return useStorage(key, defaultValue, window.sessionStorage)
}

function useStorage(key: any, defaultValue: any, storageObject: Storage) {
    const [value, setValue] = useState(() => {
        const jsonValue = storageObject.getItem(key)
        if (jsonValue != null) return JSON.parse(jsonValue)
        if (typeof defaultValue === "function") {
            return defaultValue()
        } else {
            return defaultValue
        }
    })
    useEffect(() => {
        if (value === undefined) return storageObject.removeItem(key)
        storageObject.setItem(key, JSON.stringify(value))
    }, [key, value, storageObject])
    const remove = useCallback(() => {
        setValue(undefined)
    }, [])
    return [value, setValue, remove]
}

export default function GameHandler() {

    const [login, setLogin, removeLogin] = useLocalStorage("login", undefined);

    const [inputText, setInputText] = useState("");
    function handleInputTextChange(e: ChangeEvent<HTMLInputElement>) {
        setInputText(e.target.value);
    }

    const [loading, setLoading] = useState(0);
    const [hidden, setHidden] = useState("hidden");


    const bruh = (v: number) => {
        setLoading(v)
        if (v < 100 - 2) {
            setTimeout(bruh, 100, v + 2)
        }
        else {
            setLoading(0);
            bruh(0);
        }
    }

    useEffect(() => {
        bruh(0);
        // setLoading(loading == 1 ? 0 : 1);

    }, [])

    return (
        <div className="flex flex-col full-size full-center bg-black border-green-500 border-solid border-2 text-green-500">
            {(loading < 100) ?
                (<div className="flex flex-col gap-2 full-size full-center">
                    {/* Loading */}
                    <div className="flex flex-col w-[256] h-4 border-green-500 border-solid border-2">
                        <div
                            // onTransitionEnd={() => setLoading(loading == 1 ? 0 : 1)}

                            style={{
                                backgroundColor: "rgb(34,197,94)",
                                transitionDuration: "100ms",
                                height: "100%",
                                width: (1 * loading) + "%"
                            }}
                        ></div>
                    </div>
                </div>)
                :
                (<div className={`flex flex-col gap-2 w-16 h-16 full-center bg-blue-500 duration-1000 ${hidden}`}>
                    bruhhh
                </div>)
            }
        </div >
    );
}