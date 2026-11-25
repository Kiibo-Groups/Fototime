require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database in Mexican Pesos (MXN)...');

  const defaultPasswordHash = await bcrypt.hash('Admin15978xy.', 10);

  // 1. Create default demo photographer
  const photographer = await prisma.user.upsert({
    where: { email: 'marcos@fototime.co' },
    update: {
      passwordHash: defaultPasswordHash,
    },
    create: {
      email: 'marcos@fototime.co',
      passwordHash: defaultPasswordHash,
      name: 'Marcos Benítez',
      username: 'marcos-ph',
      role: 'PHOTOGRAPHER',
      phone: '+52 55 1234 5678',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: 'Fotógrafo profesional deportivo con más de 8 años en eventos en México.',
      instagram: 'marcosbenitez.ph',
      website: 'https://marcosph.mx',
    },
  });

  // 2. Create Event (CDMX 21K)
  const event = await prisma.event.upsert({
    where: { slug: 'maraton-cdmx-2026' },
    update: {
      pricePerPhoto: 120,
      fullAlbumPrice: 690,
    },
    create: {
      slug: 'maraton-cdmx-2026',
      title: 'Medio Maratón CDMX 21K - Reforma & Chapultepec',
      description: 'La carrera más emblemática de la Ciudad de México. Ángel de la Independencia y Meta.',
      category: 'RUNNING',
      date: new Date('2026-11-20'),
      location: 'Ciudad de México (Paseo de la Reforma)',
      coverImage: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&auto=format&fit=crop&q=80',
      pricePerPhoto: 120, // $120 MXN
      fullAlbumPrice: 690, // $690 MXN
      fullAlbumDiscountPct: 35,
      photographerId: photographer.id,
    },
  });

  console.log(`✅ Evento creado en México: ${event.title} (ID: ${event.id})`);
  console.log('✅ Base de datos sembrada con éxito en MXN.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
