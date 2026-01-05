'use client'
import BreadCrumbs from '@/components/Admin/BreadCrumb'
import DataTableWrapper from '@/components/Admin/DataTableWrapper'
// import EditAction from '@/components/Admin/EditAction'
import DeleteAction from '@/components/Admin/DeleteAction'
// import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DT_CATEGORY_COLUMN, DT_COUPON_COLUMN, DT_CUSTOMERS_COLUMN, DT_PRODUCT_COLUMN, DT_PRODUCT_VARIANT_COLUMN, DT_REVIEW_COLUMN } from '@/lib/column'
import { columnConfig } from '@/lib/helperFunction'
import { ADMIN_CATEGORY_ADD, ADMIN_CATEGORY_EDIT, ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD, ADMIN_TRASH } from '@/routes/AdminPanelRoute'
import Link from 'next/link'
import React, { useCallback, useMemo } from 'react'
// import { FiPlus } from 'react-icons/fi'
import { useSearchParams } from 'next/navigation'

const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home'},
    { href: ADMIN_TRASH, label: 'Trash'},
]

const TRASH_CONFIG = {
  category: {
    title: 'Category Trash',
    columns: DT_CATEGORY_COLUMN,
    fetchUrl:'/api/category',
    exportUrl:'/api/category/export',
    deleteUrl:'/api/category/delete',
  },
  product: {
    title: 'Product Trash',
    columns: DT_PRODUCT_COLUMN,
    fetchUrl:'/api/product',
    exportUrl:'/api/product/export',
    deleteUrl:'/api/product/delete',
  },
  'product-variant': {
    title: 'Product Variant Trash',
    columns: DT_PRODUCT_VARIANT_COLUMN,
    fetchUrl:'/api/product-variant',
    exportUrl:'/api/product-variant/export',
    deleteUrl:'/api/product-variant/delete',
  },
  coupon: {
    title: 'Coupon Trash',
    columns: DT_COUPON_COLUMN,
    fetchUrl:'/api/coupon',
    exportUrl:'/api/coupon/export',
    deleteUrl:'/api/coupon/delete',
  },
  customers: {
    title: 'Customer Trash',
    columns: DT_CUSTOMERS_COLUMN,
    fetchUrl:'/api/customers',
    exportUrl:'/api/customers/export',
    deleteUrl:'/api/customers/delete',
  },
  review: {
    title: 'Review Trash',
    columns: DT_REVIEW_COLUMN,
    fetchUrl:'/api/review',
    exportUrl:'/api/review/export',
    deleteUrl:'/api/review/delete',
  },
}

const Trash = () => {
    const searchParams = useSearchParams()
    const trashOf = searchParams.get('trashof')

    const config = TRASH_CONFIG[trashOf]

    if (!config) {
        return (
            <div>
                <BreadCrumbs breadcrumbData={breadcrumbData}/>
                <Card className="py-0 rounded shadow-sm">
                    <CardContent className="p-6">
                        <div className="text-center text-red-500">
                            Invalid trash type: {trashOf}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const columns = useMemo(() =>{
    return columnConfig(config.columns, false, false, true)
      //  const result = columnConfig(DT_CATEGORY_COLUMN);
  // if (!Array.isArray(result)) {
  //   console.error("columnConfig did not return a valid array:", result);
  //   return [];
  // }
  // return result;
    },[])
    
    const action = useCallback((row,deleteType,handleDelete) =>{
      // let actionMenu = []
      return [<DeleteAction key='delete' handleDelete={handleDelete} row={row} deleteType={deleteType}/>]
      // return actionMenu
    },[])
  return (
      <div>
        <BreadCrumbs breadcrumbData={breadcrumbData}/>
        <Card className="py-0 rounded shadow-sm gap-0">
            <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
                <div className='flex justify-between items-center'>
                    <h4 className=" font-semibold text-xl">{config.title}</h4>
                    {/* <Button>
                        <FiPlus/>
                        <Link href={ADMIN_CATEGORY_ADD}>New Category</Link>
                    </Button> */}
                </div>
            </CardHeader>
            <CardContent className="pb-5 px-0">
                <DataTableWrapper
                    queryKey={`${trashOf}-data-deleted`}
                    fetchUrl={config.fetchUrl}
                    initialPageSize={10}
                    columnsConfig={columns}
                    exportEndpoint={config.exportUrl}
                    deleteEndpoint={config.deleteUrl}
                    deleteType='PD'
                    // trashView={`${ADMIN_TRASH}?trashof=category`}
                    createAction = {action}
                />
            </CardContent>
          </Card>
      </div>
  )
}

export default Trash