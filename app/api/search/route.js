import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
const query = request.nextUrl.searchParams.get("query") 
//Replace the uri string with your connection string.
 const uri = "mongodb+srv://sunidhipal629:watch%40out@cluster1.rhy3t8j.mongodb.net/";
 const client = new MongoClient(uri);
   try {
     const database = client.db('stock');
     const inventory = database.collection('inventory');
     

     const allProducts = await inventory.aggregate([
        {
            $match: {
                $or: [
                    { slug: { $regex: query, $options: 'i' } },  // Partial match in Product Name 
                    // { category: { $regex: "your_query_string", $options: 'i' } },  // Partial match in Category
                    // { quantity: { $regex: "your_query_string", $options: 'i' } },  // Partial match in Quantity
                    // { price: { $regex: "your_query_string", $options: 'i' } }  // Partial match in Price
                    ]
                }
        }
    ]).toArray()
     return NextResponse.json({ succes: true, allProducts})
   } finally {
    //Ensures that the client will close when you finish/error
     await client.close();
   }
}


