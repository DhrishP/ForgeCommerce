import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import SettingsPage from "./(components)/Settings-page";



export default async function Settings({params}:{params:{StoreId:string}}){
  console.log(params.StoreId)
      const {userId} = auth()
      if(!userId) {redirect('/sign-in')}
      const FindStoreInfo = await prisma.store.findFirst({
        where:{
          id:params.StoreId,
          userId:userId
        }
      })

      if (FindStoreInfo) {
        return(
          <SettingsPage name={FindStoreInfo.name} id={FindStoreInfo.id}/>
        )
      }
      redirect('/')
      

}