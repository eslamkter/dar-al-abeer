import test from 'node:test';
import assert from 'node:assert/strict';
import {selectVariant} from '../src/lib/variants.ts';
const product={id:'p1',slug:'test',name:'Test',price:100,stock:9,image:'/base.webp',description:'',shortDescription:'',sale_price:80,variants:[{id:'small',label:'30 ml',price:60,stock:3,image:'/small.webp'},{id:'large',label:'100 ml',price:150,stock:0,image:'/large.webp'}]};
test('selected option keeps price, stock, image and cart identity together',()=>{
 const small=selectVariant(product,'small'),large=selectVariant(product,'large');
 assert.deepEqual([small.price,small.stock,small.image,small.productId,small.selectedVariantId],[60,3,'/small.webp','p1','small']);
 assert.notEqual(small.id,large.id);
 assert.equal(large.stock,0);
 assert.equal(small.sale_price,null);
 assert.equal(small.slug,product.slug);
 assert.equal(product.sale_price,80);
});
test('invalid option cannot silently purchase a different option',()=>{
 assert.throws(()=>selectVariant(product,'missing'));
 assert.throws(()=>selectVariant(product));
});
test('simple products preserve their existing offer and identity',()=>{
 const simple={...product,variants:undefined};assert.equal(selectVariant(simple),simple);
});
