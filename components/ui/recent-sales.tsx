import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatter } from "@/lib/utils";
export type Data = {
  id: string;
  name: string;
  email: string;
  pricePaid: number;
};
type SalesProps = {
  data: Data[] | null;
};
const Sales = ({ data }: SalesProps) => {
  if (!data) return null; 
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>Recent customers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {data.map((user) => (
            <div key={user.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>PFP</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="ml-auto font-medium">
                +{formatter.format(user.pricePaid)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Sales;
