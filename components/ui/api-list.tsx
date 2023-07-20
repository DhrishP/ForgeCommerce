"use client"
import ApiBlock from '@/components/ui/api-block'
import UseOrigin from '@/hooks/origin-client'
import { useParams } from 'next/navigation'
import React from 'react'

type ApiListProps = {
  Entityname:string,
  EntityIdname:string

}

const ApiList = ({Entityname,EntityIdname}:ApiListProps) => {
  const params = useParams()
  const origin = UseOrigin()
  const baseUrl = `${origin}/api/${params.StoreId}`
  return (
    <>
    <ApiBlock title='GET' variant='public' description={`${baseUrl}/${Entityname}`}/>
    <ApiBlock title='GET' variant='public' description={`${baseUrl}/${Entityname}/${EntityIdname}`}/>
    <ApiBlock title='POST' variant='admin' description={`${baseUrl}/${Entityname}`} />
    <ApiBlock title='PATCH' variant='admin' description={`${baseUrl}/${Entityname}/${EntityIdname}`} />
    <ApiBlock title='DELETE' variant='admin' description={`${baseUrl}/${Entityname}/${EntityIdname}`} />
    </>
  )
}

export default ApiList

