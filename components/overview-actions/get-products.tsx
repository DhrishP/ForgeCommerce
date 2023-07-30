import prisma from "@/prisma/client";


export default async function(StoreId:string){
    const res = await prisma.products.findMany({
        where:{
            StoreId,
            Archived:false
        }
    })

    return res.length
}