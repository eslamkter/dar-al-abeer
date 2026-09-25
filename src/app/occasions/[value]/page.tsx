import { DiscoveryPage, discoveryMetadata } from "@/components/product/DiscoveryPage";
type Props = {params: Promise<{value: string}>};
export async function generateMetadata({params}: Props) { return discoveryMetadata("occasions", decodeURIComponent((await params).value)); }
export default async function Page({params}: Props) { return <DiscoveryPage kind="occasions" value={decodeURIComponent((await params).value)} />; }
