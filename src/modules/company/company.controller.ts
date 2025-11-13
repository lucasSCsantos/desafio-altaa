import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { createCompany, getCompany, listCompanies, selectCompany } from './company.service';
import { createCompanySchema, selectCompanySchema } from './company.schema';

export async function createCompanyController(req: Request) {
  try {
    const token = req.headers.get('cookie')?.split('session=')[1];
    const session = verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    const parsed = createCompanySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const company = await createCompany(parsed.data, session);
    return NextResponse.json(company);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}

export async function listCompaniesController(req: Request) {
  try {
    const token = req.headers.get('cookie')?.split('session=')[1];
    const session = verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const page = Number(new URL(req.url).searchParams.get('page') || 1);
    const companies = await listCompanies(session, page);
    return NextResponse.json(companies);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function selectCompanyController(req: Request) {
  try {
    const token = req.headers.get('cookie')?.split('session=')[1];
    const session = verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    const parsed = selectCompanySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const newToken = await selectCompany(session, parsed.data);
    return NextResponse.json(newToken);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function getCompanyController(req: Request) {
  try {
    const token = req.headers.get('cookie')?.split('session=')[1];
    const session = verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const company = await getCompany(session);
    return NextResponse.json(company);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}
