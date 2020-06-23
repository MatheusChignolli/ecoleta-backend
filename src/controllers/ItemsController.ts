import { Request, Response } from 'express';
import knex from '../database/connection'

class ItemController {
    async index(req: Request, res: Response) {
        const items = await knex('items').select('*');

        const serializedItem = items.map(item => {
            return {
                id: item.id,
                name: item.title,
                // image: `http://localhost:3333/uploads/${item.image}`,
                image: `http://192.168.15.16:3333/uploads/${item.image}`,
                darkImage: `http://192.168.15.16:3333/uploads/${item.darkImage}`,
            }
        });

        return res.json(serializedItem);
    }
}

export default ItemController;