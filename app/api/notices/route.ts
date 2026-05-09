import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase, supabaseAdmin } from "@/lib/supabase";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim());

export async function GET() {
  const { data, error } = await supabase
    .from("notices")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const email = session?.user?.email ?? "";

  if (!email || !ADMIN_EMAILS.includes(email)) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const body = await req.json();
  const { category, title, content, thumbnail, bg, date } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "제목을 입력해주세요." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("notices")
    .insert({ category, title, content, thumbnail, bg, date, author_email: email })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  const email = session?.user?.email ?? "";

  if (!email) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = await req.json();
  const { id, category, title, content, thumbnail, bg } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "제목을 입력해주세요." }, { status: 400 });
  }

  // 작성자 본인인지 확인
  const { data: existing } = await supabaseAdmin
    .from("notices")
    .select("author_email")
    .eq("id", id)
    .single();

  if (existing?.author_email !== email) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("notices")
    .update({ category, title, content, thumbnail, bg })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  const email = session?.user?.email ?? "";

  if (!email || !ADMIN_EMAILS.includes(email)) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "id가 필요합니다." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("notices")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
