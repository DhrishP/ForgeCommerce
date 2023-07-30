"use client"
import { useParams, usePathname } from 'next/navigation'
import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'


const MainNav = ({className,...props}:React.HtmlHTMLAttributes<HTMLElement>) => {
    const params = useParams()
    const pathname = usePathname()

    const routes = [
        {
            href:`/${params.StoreId}`,
            label:'Dashboard',
            active:pathname === `/${params.StoreId}`
        },
        {
            href:`/${params.StoreId}/billboards`,
            label:'Billboards',
            active:pathname === `/${params.StoreId}/billboards`
        },
        {
            href:`/${params.StoreId}/categories`,
            label:'Categories',
            active:pathname === `/${params.StoreId}/categories`  
        },
        {
            href:`/${params.StoreId}/colors`,
            label:'Colors',
            active:pathname === `/${params.StoreId}/colors`  
        },
        {
            href:`/${params.StoreId}/sizes`,
            label:'Sizes',
            active:pathname === `/${params.StoreId}/sizes`  
        },
        {
            href:`/${params.StoreId}/products`,
            label:'Products',
            active:pathname === `/${params.StoreId}/products`  
        },
        {
            href:`/${params.StoreId}/orders`,
            label:'Orders',
            active:pathname === `/${params.StoreId}/orders`  
        },
        {
            href:`/${params.StoreId}/settings`,
            label:'Settings',
            active:pathname === `/${params.StoreId}/settings`
        }
    ]
  return (
    <>
    <ul className={cn('flex items-center space-x-4 lg:space-x-6',className)}>
        {
            routes.map(route =>(
               
                <Link key={route.href} className={cn('font-medium text-sm transition-colors hover:text-primary dark:text-white ',
                route.active? 'text-black dark:text-white':'text-muted-foreground'
                )} href={route.href} id={route.href}>{route.label}</Link>
             
            ))
        }
    </ul>
    </>
  )
}

export default MainNav