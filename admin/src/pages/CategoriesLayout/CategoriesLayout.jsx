import React from 'react'
import CategoriesManage from '../CategoriesManage'
import { Outlet } from 'react-router-dom'

const CategoriesLayout = () => {
  return (
    <div className='px-6 w-full h-[90vh] flex flex-col overflow-y-auto'>
        <CategoriesManage />
        <div className='w-full'>
            <Outlet />
        </div>
    </div>
  )
}

export default CategoriesLayout