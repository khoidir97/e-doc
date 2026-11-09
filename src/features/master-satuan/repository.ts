import pool, { initDatabase } from '@/lib/db';
import { MasterSatuan } from '@/features/master-satuan/types';

export class MasterSatuanRepository {
    static async findMany(search = '', limit = 10, offset = 0): Promise<{ data: MasterSatuan[]; total: number }> {
        await initDatabase();

        let whereClause = 'WHERE p.st_deleted_at IS NULL';
        const params: any[] = [];

        if (search.trim()) {
            whereClause += ' AND (p.st_nama LIKE ?)';
            const term = `%${search.trim()}%`;
            params.push(term);
        }

        // Count query
        const [countRows] = await pool.query<any[]>(
            `SELECT COUNT(*) as total 
       FROM satuan p
       ${whereClause}`,
            params
        );
        const total = countRows[0]?.total || 0;

        // Data query
        const dataParams = [...params, Number(limit), Number(offset)];
        const [rows] = await pool.query<any[]>(
            `SELECT p.st_id, p.st_nama, p.st_created_at, p.st_updated_at
       FROM satuan p
       ${whereClause} 
       ORDER BY p.st_id DESC 
       LIMIT ? OFFSET ?`,
            dataParams
        );

        return {
            data: rows as MasterSatuan[],
            total,
        };
    }

    static async findById(st_id: number): Promise<MasterSatuan | null> {
        await initDatabase();
        const [rows] = await pool.query<any[]>(
            `SELECT p.st_id, p.st_nama, p.st_created_at, p.st_updated_at
       FROM satuan p
       WHERE p.st_id = ? AND p.st_deleted_at IS NULL 
       LIMIT 1`,
            [st_id]
        );
        if (!rows || rows.length === 0) return null;
        return rows[0] as MasterSatuan;
    }
}
