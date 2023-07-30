import getGraphdata from "@/components/overview-actions/get-graphdata";
import getProducts from "@/components/overview-actions/get-products";
import getRevenue from "@/components/overview-actions/get-revenue";
import getSales from "@/components/overview-actions/get-sales";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import OverviewGraph from "@/components/ui/overview-graph";
import { Separator } from "@/components/ui/separator";
import { formatter } from "@/lib/utils";
import { CreditCard, DollarSign, Shirt } from "lucide-react";
import React from "react";

const Dashboard = async ({ params }: { params: { StoreId: string } }) => {
  const sales = await getSales(params.StoreId);
  const AvailProducts = await getProducts(params.StoreId);
  const Totalrevenue = await getRevenue(params.StoreId);
  const GraphData = await getGraphdata(params.StoreId)
  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 w-full h-full">
      <Heading title="Dashboard" description="Overview of your store" />
      <Separator />
      <div className="grid sm:grid-cols-3 w-full gap-6 mt-2 ">
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-md">Total Revenue</CardTitle>
              <CardDescription className="text-muted-foreground">
                <DollarSign className="w-5 h-5" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold ">
                {formatter.format(Totalrevenue)}
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-md">Total Sales</CardTitle>
              <CardDescription className="text-muted-foreground">
                <CreditCard className="w-5 h-5" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold ">+{sales}</div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-md flex">
                Total products<span className="hidden md:block">(in stock)</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                <Shirt className="w-5 h-5" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold ">{AvailProducts}</div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid md:grid-cols-5 md:mt-12 mt-5">
          <div className="col-span-3">
            <OverviewGraph data={GraphData}/>
          </div>
          <div className="col-span-2">
            CustomerReport
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
