import prisma from "@/prisma/client";


export default async function getProducts(StoreId:string){
    if(!StoreId) return null
    const res = await prisma.products.findMany({
        where:{
            StoreId,
            Archived:false
        }
    })
    return res.length
}