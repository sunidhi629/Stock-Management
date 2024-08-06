import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {

//Replace the uri string with your connection string.
 const uri = "mongodb+srv://sunidhipal629:watch%40out@cluster1.rhy3t8j.mongodb.net/";
 const client = new MongoClient(uri);
   try {
     const database = client.db('sunidhi');
     const movies = database.collection('inventory');
     const query = {  };
     const movie = await movies.find(query).toArray();
     console.log(movie);
     return NextResponse.json({"a": 34, movie})
   } finally {
    //Ensures that the client will close when you finish/error
     await client.close();
   }
 
}