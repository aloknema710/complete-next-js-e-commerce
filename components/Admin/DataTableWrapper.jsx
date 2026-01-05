'use client'
import { ThemeProvider } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DataTable from './DataTable'
import { useTheme } from 'next-themes'
import { darkTheme, lightTheme } from '@/lib/materialTheme'

const DataTableWrapper = ({
    queryKey,
    fetchUrl,
    columnsConfig,
    initialPageSize = 10,
    exportEndpoint,
    deleteEndpoint,
    deleteType,
    trashView,
    createAction
}) => {
    const { theme, systemTheme } = useTheme() // Fixed: should be 'theme', not 'resolverTheme'
    const [mounted, setMounted] = useState(false)
    
    useEffect(() => {
        setMounted(true)
    }, [])
    
    if(!mounted) return null;

    // Determine current theme - use system theme if theme is 'system'
    const currentTheme = theme === 'system' ? systemTheme : theme;
    
    return (
        <ThemeProvider theme={currentTheme === 'dark' ? darkTheme : lightTheme}>
            <DataTable
                queryKey={queryKey}
                fetchUrl={fetchUrl}
                columnsConfig={columnsConfig}
                initialPageSize={initialPageSize}
                exportEndpoint={exportEndpoint}
                deleteEndpoint={deleteEndpoint}
                deleteType={deleteType}
                trashView={trashView}
                createAction={createAction}
            />
        </ThemeProvider>
    )
}

export default DataTableWrapper



// 'use client'
// import { ThemeProvider } from '@mui/material'
// import React, { useEffect, useState } from 'react'
// import DataTable from './DataTable'
// import { useTheme } from 'next-themes'
// import { darkTheme, lightTheme } from '@/lib/materialTheme'

// const DataTableWrapper = ({
//     queryKey,
//     fetchUrl,
//     columnsConfig,
//     initialPageSize = 10,
//     exportEndpoint,
//     deleteEndpoint,
//     deleteType,
//     trashView,
//     createAction
// }) => {
//     const {resolverTheme} = useTheme()
//     const [mounted, setMounted] = useState(false)
//     useEffect(()=>{
//         setMounted(true)
//     },[])
//     if(!mounted) return null;
//   return (
//     <ThemeProvider theme={resolverTheme === 'dark' ? darkTheme : lightTheme}>
//         <DataTable
//             queryKey={queryKey}
//             fetchUrl={fetchUrl}
//             columnsConfig={columnsConfig}
//             initialPageSize={initialPageSize}
//             exportEndpoint={exportEndpoint}
//             deleteEndpoint={deleteEndpoint}
//             deleteType={deleteType}
//             trashView={trashView}
//             createAction={createAction}
//         />
//     </ThemeProvider>
//   )
// }

// export default DataTableWrapper