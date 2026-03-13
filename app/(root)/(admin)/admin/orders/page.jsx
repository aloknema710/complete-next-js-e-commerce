'use client'
import BreadCrumbs from '@/components/Admin/BreadCrumb'
import DataTableWrapper from '@/components/Admin/DataTableWrapper'
import EditAction from '@/components/Admin/EditAction'
import DeleteAction from '@/components/Admin/DeleteAction'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DT_COUPON_COLUMN, DT_ORDER_COLUMN} from '@/lib/column'
import { columnConfig } from '@/lib/helperFunction'
import { ADMIN_COUPON_ADD, ADMIN_COUPON_EDIT, ADMIN_COUPON_SHOW, ADMIN_DASHBOARD, ADMIN_ORDER_DETAILS, ADMIN_PRODUCT_ADD, ADMIN_PRODUCT_EDIT, ADMIN_PRODUCT_SHOW, ADMIN_TRASH } from '@/routes/AdminPanelRoute'
import Link from 'next/link'
import React, { useCallback, useMemo } from 'react'
import { FiPlus } from 'react-icons/fi'
import ViewAction from '@/components/Admin/EditAction copy'

const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home'},
    { href: '', label: 'Order'},
]

const ShowOrder = () => {
    const columns = useMemo(() =>{
    return columnConfig(DT_ORDER_COLUMN)
      //  const result = columnConfig(DT_CATEGORY_COLUMN);
  // if (!Array.isArray(result)) {
  //   console.error("columnConfig did not return a valid array:", result);
  //   return [];
  // }
  // return result;
    },[])
    
    const action = useCallback((row,deleteType,handleDelete) =>{
      let actionMenu = []
      actionMenu.push(<ViewAction key='view' href={ADMIN_ORDER_DETAILS(row.original.order_id)}/>)
      actionMenu.push(<DeleteAction key='delete' handleDelete={handleDelete} row={row} deleteType={deleteType}/>)
      return actionMenu
    },[])
  return (
      <div>
        <BreadCrumbs breadcrumbData={breadcrumbData}/>
        <Card className="py-0 rounded shadow-sm gap-0">
            <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
                <div className='flex justify-between items-center'>
                    <h4 className=" font-semibold text-xl">Orders</h4>
                 
                </div>
            </CardHeader>
            <CardContent className="pb-5 px-0">
                <DataTableWrapper
                    queryKey='orders-data'
                    fetchUrl='/api/orders'
                    columnsConfig={columns}
                    initialPageSize={10}
                    exportEndpoint='/api/orders/export'
                    deleteEndpoint='/api/orders/delete'
                    deleteType='SD'
                    trashView={`${ADMIN_TRASH}?trashof=orders`}
                    createAction = {action}
                />
            </CardContent>
          </Card>
      </div>
  )
}

export default ShowOrder