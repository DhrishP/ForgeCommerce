import prisma from "@/prisma/client";
import redis from '@/lib/redis';

export default async function getProducts(StoreId:string){
    if(!StoreId) return null
    const cachedVAL:string | null = await redis.get(`getProducts:${StoreId}`)
    if(cachedVAL ){
      
        return cachedVAL
    }
    const res = await prisma.products.findMany({
        where:{
            StoreId,
            Archived:false
        }
    })
    await redis.set(`getProducts:${StoreId}`,res.length)
    await redis.expire(`getProducts:${StoreId}`,60*60)
    return res.length
}