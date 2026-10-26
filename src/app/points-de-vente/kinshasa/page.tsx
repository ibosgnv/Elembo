import { CityPage, cityMetadata } from "@/components/CityPage";

export const metadata = cityMetadata("kinshasa");

export default function Page() {
  return <CityPage slug="kinshasa" />;
}
