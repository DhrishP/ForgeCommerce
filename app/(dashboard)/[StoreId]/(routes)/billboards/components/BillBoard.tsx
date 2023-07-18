"use client"
import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Plus } from 'lucide-react'
import React from 'react'
import { useParams, useRouter } from 'next/navigation'

const Billboard = () => {
    const router = useRouter()
    const params= useParams()
  return (
    <div className='flex items-center justify-between'>
        <div>
        <Heading title='Billboards(0)' description='Create and manage billboards'/>
        </div>
        <Button onClick={()=>{router.push(`/${params.StoreId}/billboards/new`)}} className='gap-x-2'>
            <Plus className='h-5 w-4'/>
            New
        </Button>

    </div>
  )
}

export default Billboard