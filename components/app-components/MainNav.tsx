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
            href:`/${params.storeId}/settings`,
            label:'Settings',
            active:pathname === `/${params.storeId}/settings`
        }
    ]
  return (
    <>
    <ul className={cn('flex items-center space-x-4 lg:space-x-6',className)}>
        {
            routes.map(route =>(
                <>
                <Link className={cn('font-medium text-sm transition-colors hover:text-primary dark:text-white ',
                route.active? 'text-black dark:text-white':'text-muted-foreground'
                )} href={route.href} id={route.href}>{route.label}</Link>
                </>
            ))
        }
    </ul>
    </>
  )
}

export default MainNav