import { CityPage, cityMetadata } from "@/components/CityPage";

export const metadata = cityMetadata("matadi");

export default function Page() {
  return <CityPage slug="matadi" />;
}
