'use client'
import BreadCrumbs from '@/components/Admin/BreadCrumb'
import DataTableWrapper from '@/components/Admin/DataTableWrapper'
import EditAction from '@/components/Admin/EditAction'
import DeleteAction from '@/components/Admin/DeleteAction'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DT_CATEGORY_COLUMN, DT_PRODUCT_COLUMN, DT_PRODUCT_VARIANT_COLUMN } from '@/lib/column'
import { columnConfig } from '@/lib/helperFunction'
import { ADMIN_CATEGORY_ADD, ADMIN_CATEGORY_EDIT, ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD, ADMIN_PRODUCT_ADD, ADMIN_PRODUCT_EDIT, ADMIN_PRODUCT_SHOW, ADMIN_PRODUCT_VARIANT_ADD, ADMIN_PRODUCT_VARIANT_EDIT, ADMIN_PRODUCT_VARIANT_SHOW, ADMIN_TRASH } from '@/routes/AdminPanelRoute'
import Link from 'next/link'
import React, { useCallback, useMemo } from 'react'
import { FiPlus } from 'react-icons/fi'

const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home'},
    { href: ADMIN_PRODUCT_VARIANT_SHOW, label: 'Product Variant'},
]

const ShowProductVariant = () => {
    const columns = useMemo(() =>{
    return columnConfig(DT_PRODUCT_VARIANT_COLUMN)
      //  const result = columnConfig(DT_CATEGORY_COLUMN);
  // if (!Array.isArray(result)) {
  //   console.error("columnConfig did not return a valid array:", result);
  //   return [];
  // }
  // return result;
    },[])
    
    const action = useCallback((row,deleteType,handleDelete) =>{
      let actionMenu = []
      actionMenu.push(<EditAction key='edit' href={ADMIN_PRODUCT_VARIANT_EDIT(row.original._id)}/>)
      actionMenu.push(<DeleteAction key='delete' handleDelete={handleDelete} row={row} deleteType={deleteType}/>)
      return actionMenu
    },[])
  return (
      <div>
        <BreadCrumbs breadcrumbData={breadcrumbData}/>
        <Card className="py-0 rounded shadow-sm gap-0">
            <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
                <div className='flex justify-between items-center'>
                    <h4 className=" font-semibold text-xl">Show Product Variants</h4>
                    <Button>
                        <FiPlus/>
                        <Link href={ADMIN_PRODUCT_VARIANT_ADD}>New Variants</Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pb-5 px-0">
                <DataTableWrapper
                    queryKey='-variant-data'
                    fetchUrl='/api/product-variant'
                    columnsConfig={columns}
                    initialPageSize={10}
                    exportEndpoint='/api/product-variant/export'
                    deleteEndpoint='/api/product-variant/delete'
                    deleteType='SD'
                    trashView={`${ADMIN_TRASH}?trashof=product-variant`}
                    createAction = {action}
                />
            </CardContent>
          </Card>
      </div>
  )
}

export default ShowProductVariant