import {ScentFinder} from "@/components/product/ScentFinder";
import {Container} from "@/components/ui/Container";
import {discoveryUi as ui} from "@/config/discovery";
import {getProducts} from "@/lib/products";
import {pageSeo} from "@/lib/seo";
export const metadata={...pageSeo('/scent-finder'),title:ui.finderTitle,description:ui.finderIntro};
export default async function Page(){return <Container className="py-14"><h1 className="font-heading text-4xl">{ui.finderTitle}</h1><p className="mt-5 text-muted">{ui.finderIntro}</p><ScentFinder products={await getProducts()}/></Container>;}
