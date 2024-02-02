import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import redis from "@/lib/redis";

export default async function RootLayout2({children}:{children:React.ReactNode}){
    const {userId} = auth()
    if (!userId) {
        redirect('/sign-in')
    }
    const cachedVAL = await redis.get(`store:${userId}`)
    if (cachedVAL) {
        redirect(`/${cachedVAL}`)
    }
    const findStore = await prisma.store.findFirst({
        where:{
            userId:userId
        }
    })
    if (findStore) {
        await redis.set(`store:${userId}`,findStore.id)
        await redis.expire(`store:${userId}`,60*60)
        redirect(`/${findStore.id}`)
        
    }
    return(
        <>
        {children}
        </>
    )
    
}