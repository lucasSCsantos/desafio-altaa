import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import {
  createCompany,
  deleteCompany,
  getCompany,
  listCompanies,
  selectCompany,
} from './company.service';
import { CreateCompanyBodySchema } from '@/schemas/company.schema';
import { cookies } from 'next/headers';
import { createErrorResponse } from '@/lib/error-handler';

export async function createCompanyController(req: NextRequest) {
  try {
    const token = (await cookies()).get('session')?.value;
    const session = verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    const parsed = CreateCompanyBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const company = await createCompany(parsed.data, session);
    return NextResponse.json(company);
  } catch (error) {
    return createErrorResponse(error);
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
    return createErrorResponse(error);
  }
}

export async function selectCompanyController(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = (await cookies()).get('session')?.value;
    const session = verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: companyId } = await params;

    const newToken = await selectCompany(session, companyId);

    const res = NextResponse.json({ success: true });

    res.cookies.set('session', newToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    });

    return res;
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function getCompanyController() {
  try {
    const token = (await cookies()).get('session')?.value;
    const session = verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const company = await getCompany(session);
    return NextResponse.json(company);
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function deleteCompanyController() {
  try {
    const token = (await cookies()).get('session')?.value;
    const session = verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await deleteCompany(session);

    return NextResponse.json({ success: true });
  } catch (error) {
    return createErrorResponse(error);
  }
}
