import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Por favor ingresa tu correo y contraseña.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Find user in PostgreSQL
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: 'Credenciales inválidas. Verifica tu correo y contraseña.' },
        { status: 401 }
      );
    }

    // Verify password hash
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Credenciales inválidas. Verifica tu correo y contraseña.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        username: user.username,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error: any) {
    console.error('Error in /api/auth/login:', error);
    return NextResponse.json(
      { error: 'Error del servidor al intentar iniciar sesión.' },
      { status: 500 }
    );
  }
}
