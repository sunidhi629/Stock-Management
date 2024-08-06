import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {

//Replace the uri string with your connection string.
 const uri = "mongodb+srv://sunidhipal629:watch%40out@cluster1.rhy3t8j.mongodb.net/";
 const client = new MongoClient(uri);
   try {
     const database = client.db('stock');
     const inventory = database.collection('inventory');
     const query = {  };
     const allProducts = await inventory.find(query).toArray();
     return NextResponse.json({ succes: true, allProducts})
   } finally {
    //Ensures that the client will close when you finish/error
     await client.close();
   }
}

export async function POST(request) {
    let body= await request.json()
    console.log(body)
     const uri = "mongodb+srv://sunidhipal629:watch%40out@cluster1.rhy3t8j.mongodb.net/";
     const client = new MongoClient(uri);
       try {
         const database = client.db('stock');
         const inventory = database.collection('inventory');
         const product = await inventory.insertOne(body)
         return NextResponse.json({product, ok:true})
       } finally {
        //Ensures that the client will close when you finish/error
         await client.close();
       }
    }