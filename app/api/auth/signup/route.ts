import { NextRequest, NextResponse } from 'next/server';
import dbConnect, { tryDbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import { createDemoUser } from '@/lib/demo-store';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const trimmedName = String(name).trim();

  try {
    const hasDatabase = await tryDbConnect();

    if (!hasDatabase) {
      const user = createDemoUser({
        name: trimmedName,
        email: normalizedEmail,
        password,
      });

      if (!user) {
        return NextResponse.json({ error: 'User already exists' }, { status: 409 });
      }

      return NextResponse.json(
        {
          message: 'User created successfully',
          mode: 'demo',
          demoCredentials: { email: user.email },
        },
        { status: 201 },
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const user = new User({
      name: trimmedName,
      email: normalizedEmail,
      password: hashPassword(password),
    });

    await user.save();
    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'User creation failed' }, { status: 400 });
  }
}
