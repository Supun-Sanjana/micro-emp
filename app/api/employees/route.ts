import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(employees);
  } catch (error) {
    console.error("GET /api/employees error:", error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const employee = await prisma.employee.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        designation: data.designation,
        branch: data.branch,
      }
    });
    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error("POST /api/employees error:", error);
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}
