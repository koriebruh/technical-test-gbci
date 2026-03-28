import { NextRequest } from 'next/server';
import { UserController } from '@/controller/user-controller';

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Log out the current user session
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/correlationIdHeader'
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(req: NextRequest) {
  return UserController.logout(req);
}
