import { resetTestDb } from '../prisma/prepareTestDb';

export default async () => {
  resetTestDb();
};
