import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/mongodb';
import { Db, MongoError } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { db }: { db: Db } = await connectToDatabase();
            const data = req.body;
            const response = await db.collection('nom_de_votre_collection').insertOne(data);
            res.status(201).json(response);
        } catch (error) {
            const err = error as MongoError;
            res.status(500).json({ error: err.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
