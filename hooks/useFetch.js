// import response from "@/lib/helperFunction"
import axios from "axios"
import { useState, useMemo, useEffect } from "react"

const useFetch = (url, method = 'GET', options = {}) =>{
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)   
    const [error, setError] = useState(null)
    const [refreshIndex, setRefreshIndex] = useState(0)
    const optionsString = JSON.stringify(options)
    const requestOptions = useMemo(() =>{
        const opts = {...options}
        if(method === 'POST' && !opts.data){
            opts.data = {}
        }
        return opts;
    },[method, optionsString])

    useEffect(() =>{
        const apiCall = async () => {
            setLoading(true)
            setError(null)
            try {
                const {data: response} = await axios({
                    url,
                    method,
                    ...(requestOptions)
                })

                if(!response.success){
                    throw new Error(response.message)
                }

                setData(response)
            } catch (error) {
                setError(error.message)
            }finally{
                setLoading(false)
            }
        }
        apiCall()
    }, [url, refreshIndex, requestOptions])

    const refetch = () =>{
        setRefreshIndex(prev => prev + 1)
    }

    return{data, loading, error, refetch}
}

export default useFetch

// 'use client'
// import { useState, useEffect } from 'react'

// const useFetch = (url) => {
//   const [data, setData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         const response = await fetch(url)
//         const result = await response.json()
//         setData(result)
//       } catch (err) {
//         setError(err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [url])

//   return { data, loading, error }
// }

// export default useFetch