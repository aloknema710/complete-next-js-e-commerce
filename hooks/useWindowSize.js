// const { useLayoutEffect } = require("react")

const { useLayoutEffect, useState } = require("react")

const useWindowSize = () =>{
    const [size, setSize] = useState({ width: null, height: null})
    useLayoutEffect(()=>{
        const handleSize = () =>{
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }

        handleSize();

        window.addEventListener('resize', handleSize)

        return() =>{
            window.removeEventListener('resize', handleSize)
        }
    },[])

    return size;
}

export default useWindowSize