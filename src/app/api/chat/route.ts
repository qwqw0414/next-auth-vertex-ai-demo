


export interface RequestBody {

}

export async function POST(req: Request) {
  try {
    const {

    }: RequestBody = await req.json();

    return Response.json({ message: "Hello, World!" });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}