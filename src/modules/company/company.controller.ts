import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { createCompany, getCompany, listCompanies, selectCompany } from './company.service';
import { createCompanySchema } from './company.schema';
import { cookies } from 'next/headers';

export async function createCompanyController(req: NextRequest) {
  try {
    const token = (await cookies()).get('session')?.value;
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

export async function listCompaniesController(req: NextRequest) {
  try {
    const token = (await cookies()).get('session')?.value;
    const session = verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const page = req.nextUrl.searchParams.get('page');
    const companies = await listCompanies(session, page ? +page : 1);

    return NextResponse.json(companies);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function selectCompanyController(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = (await cookies()).get('session')?.value;
    const session = verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: companyId } = await params;

    const newToken = await selectCompany(session, companyId);
    return NextResponse.json(newToken);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to select company' }, { status: 500 });
  }
}

export async function getCompanyController(req: NextRequest) {
  try {
    const token = (await cookies()).get('session')?.value;
    const session = verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const company = await getCompany(session);
    return NextResponse.json(company);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}
