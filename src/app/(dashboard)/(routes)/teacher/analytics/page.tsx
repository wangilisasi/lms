import { getAnalytics } from "@/actions/get-analyitics";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import DataCard from "./_components/DataCard";
import Charts from "./_components/Charts";

const AnalyticsPage = async () => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const { data, totalRevenue, totalSales } = await getAnalytics(userId);
  return <div className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
         <DataCard
            label="Total Revenue"
            value={totalRevenue}
            shouldFormat={true}
        />
         <DataCard
            label="Total Sales"
            value={totalSales}
        />
    </div>
    <Charts
    data={data}
    />
  </div>;
};

export default AnalyticsPage;
