'use client'
import BreadCrumbs from '@/components/Admin/BreadCrumb'
import DataTableWrapper from '@/components/Admin/DataTableWrapper'
import EditAction from '@/components/Admin/EditAction'
import DeleteAction from '@/components/Admin/DeleteAction'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DT_COUPON_COLUMN, DT_CUSTOMERS_COLUMN, DT_REVIEW_COLUMN} from '@/lib/column'
import { columnConfig } from '@/lib/helperFunction'
import { ADMIN_COUPON_ADD, ADMIN_COUPON_EDIT, ADMIN_COUPON_SHOW, ADMIN_DASHBOARD, ADMIN_PRODUCT_ADD, ADMIN_PRODUCT_EDIT, ADMIN_PRODUCT_SHOW, ADMIN_TRASH } from '@/routes/AdminPanelRoute'
import React, { useCallback, useMemo } from 'react'

const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home'},
    { href: '', label: 'Review'},
]

const ShowReview = () => {
    const columns = useMemo(() =>{
    return columnConfig(DT_REVIEW_COLUMN)
      //  const result = columnConfig(DT_CATEGORY_COLUMN);
  // if (!Array.isArray(result)) {
  //   console.error("columnConfig did not return a valid array:", result);
  //   return [];
  // }
  // return result;
    },[])
    
    const action = useCallback((row,deleteType,handleDelete) =>{
      let actionMenu = []
    //   actionMenu.push(<EditAction key='edit' href={ADMIN_COUPON_EDIT(row.original._id)}/>)
      actionMenu.push(<DeleteAction key='delete' handleDelete={handleDelete} row={row} deleteType={deleteType}/>)
      return actionMenu
    },[])
  return (
      <div>
        <BreadCrumbs breadcrumbData={breadcrumbData}/>
        <Card className="py-0 rounded shadow-sm gap-0">
            <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
                <div className='flex justify-between items-center'>
                    <h4 className=" font-semibold text-xl">Reviews</h4>
                </div>
            </CardHeader>
            <CardContent className="pb-5 px-0">
                <DataTableWrapper
                    queryKey='review-data'
                    fetchUrl='/api/review'
                    columnsConfig={columns}
                    initialPageSize={10}
                    exportEndpoint='/api/review/export'
                    deleteEndpoint='/api/review/delete'
                    deleteType='SD'
                    trashView={`${ADMIN_TRASH}?trashof=review`}
                    createAction = {action}
                />
            </CardContent>
          </Card>
      </div>
  )
}

export default ShowReview