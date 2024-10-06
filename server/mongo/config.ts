import { MongoClient, Db } from 'mongodb';

const uri: string = process.env.MONGO_URI ;
const client: MongoClient = new MongoClient(uri);

async function run(): Promise<void> {
    try {
        await client.connect()
        await client.db("Datasintesa-TechTest").command({ ping: 1 });
    } catch (error) {
        console.log(error);
        await client.close();
    }
}

async function getDB(): Promise<Db> {
    return client.db("Datasintesa-TechTest");
}

export { run, getDB };
