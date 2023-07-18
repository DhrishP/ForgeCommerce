"use client"
import React, { useEffect, useState } from 'react'

const UseOrigin = () => {
    const [mounted,isMounted] = useState(false)
    const origin = typeof window !== "undefined" && window.location.origin?window.location.origin : ''
    useEffect(()=>{
        isMounted(true)
    },[])

    if (!mounted) {
        return '';
    }

    return origin
}

export default UseOrigin