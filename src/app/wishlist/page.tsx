import {Wishlist} from "@/components/product/Wishlist";
import {Container} from "@/components/ui/Container";
import {getProducts} from "@/lib/products";
import {pageSeo} from "@/lib/seo";
export const metadata={...pageSeo("/wishlist",true),title:"المفضلة"};
export default async function Page(){return <Container className="py-16"><Wishlist products={await getProducts()}/></Container>;}
