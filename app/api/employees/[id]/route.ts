import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!employee) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(employee);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employee' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const data = await request.json();
    const employee = await prisma.employee.update({
      where: { id: parseInt(id) },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        designation: data.designation,
        branch: data.branch,
      }
    });
    return NextResponse.json(employee);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await prisma.employee.delete({
      where: { id: parseInt(id) }
    });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}
