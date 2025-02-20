import HomeDisplay from "@/features/home/HomeDisplay";


export const revalidate = 60


export default async function Home() {

  return (
    <div>
      <HomeDisplay/>
    </div>
  );
}
