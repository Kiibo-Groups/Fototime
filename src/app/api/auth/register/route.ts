import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role = 'PHOTOGRAPHER', username, phone } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Por favor completa todos los campos requeridos.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta registrada con este correo electrónico.' },
        { status: 400 }
      );
    }

    // Generate username if not provided
    const userRole = role === 'CUSTOMER' ? 'CUSTOMER' : 'PHOTOGRAPHER';
    const finalUsername =
      username?.trim() ||
      cleanEmail.split('@')[0] + '-' + Math.floor(1000 + Math.random() * 9000);

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user in PostgreSQL
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: userRole,
        username: finalUsername,
        phone: phone?.trim() || null,
        avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80`,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        username: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Cuenta creada con éxito en Fototime México.',
      user,
    });
  } catch (error: any) {
    console.error('Error in /api/auth/register:', error);
    return NextResponse.json(
      { error: error?.message || 'Error interno del servidor al crear la cuenta.' },
      { status: 500 }
    );
  }
}
