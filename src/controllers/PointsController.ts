import { Request, Response } from 'express';
import knex from '../database/connection'

interface FilterQuery {
    city: string, 
    uf: string,
    items: string,
}

class PointsController {
    async index (req: Request, res: Response) {
        var points;

        const { city, uf, items } = req.query;

        if(typeof city === 'undefined') {
            points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .select('points.id', 'points.image', 'points.name', 'points.email', 'points.whatsapp', 'points.city', 'points.uf', 'points.latitude', 'points.longitude', 'point_items.point_id')
            .distinct();
        } else {
            const parsedItems = String(items)
                .split(',')
                .map(item => Number(item.trim()));

            if(city !== '0' && uf !== '0') {
                points = await knex('points')
                .join('point_items', 'points.id', '=', 'point_items.point_id')
                .whereIn('point_items.item_id', parsedItems)
                .andWhere('city', String(city))
                .andWhere('uf', String(uf))
                .select('points.id', 'points.image', 'points.name', 'points.email', 'points.whatsapp', 'points.city', 'points.uf', 'points.latitude', 'points.longitude', 'point_items.point_id')
                .distinct();
            } else if(uf !== '0') {
                points = await knex('points')
                .join('point_items', 'points.id', '=', 'point_items.point_id')
                .whereIn('point_items.item_id', parsedItems)
                .andWhere('uf', String(uf))
                .select('points.id', 'points.image', 'points.name', 'points.email', 'points.whatsapp', 'points.city', 'points.uf', 'points.latitude', 'points.longitude', 'point_items.point_id')
                .distinct();
            } else {
                points = await knex('points')
                .join('point_items', 'points.id', '=', 'point_items.point_id')
                .whereIn('point_items.item_id', parsedItems)
                .select('points.id', 'points.image', 'points.name', 'points.email', 'points.whatsapp', 'points.city', 'points.uf', 'points.latitude', 'points.longitude', 'point_items.point_id')
                .distinct();
            }
        }

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image: `http://192.168.15.16:3333/uploads/${point.image}`,
            }
        });

        return res.json(serializedPoints);
    }

    async create (req: Request, res: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items,
        } = req.body;

        const trx = await knex.transaction();

        const point = {
            image: req.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        }

        const pointIds = await trx('points').insert(point);

        const point_id = pointIds[0];

        const pointItens = items
            .split(',')
            .map((item: String) => Number(item.trim()))
            .map((item_id: number) => {
           return {
               item_id,
               point_id,
           };
        });

        await trx('point_items').insert(pointItens);

        await trx.commit();

        return res.json({
            id: point_id,
            ...point
        });
    }

    async show (req: Request, res: Response) {
        const { id } = req.params;

        const point = await knex('points').where('id', id).first();

        if(!point) {
            return res.status(400).json({ message: 'Point not found.' });
        } else {

            const serializedPoint = {
                ...point,
                image: `http://192.168.15.16:3333/uploads/${point.image}`,
            };

            const items = await knex('items')
                .join('point_items', 'items.id', '=', 'point_items.item_id')
                .where('point_items.point_id', id)
                .select('items.title');

            return res.status(200).json({ point: serializedPoint, items });
        }
    }

    async delete (req: Request, res: Response) {
        const { id } = req.params;

        const point = await knex('points').where('id', id).first();

        
        if(!point) {
            return res.status(400).json({ message: 'Point not found.' });
        } else {

            await knex('points').where('id', id).del();

            return res.status(200).json({ message: 'Point deleted.' });
        }
    }
}

export default PointsController;