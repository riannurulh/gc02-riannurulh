
import { User, UserType } from "@/app/db/models/User";
import { z, ZodError } from "zod";

const RegisterSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json() as UserType;
    RegisterSchema.parse(body)
    console.log(body,'diregis');
    
    const checkUser = await User.findOne({email:body.email})
    console.log(checkUser,'diregis2');
    
    if (checkUser) {
      console.log('masuk error');
      
      // throw new Error('Email must be unique')
      return Response.json({ error: "Email must be unique" }, { status: 400 });
    }

    await User.create(body);

    return Response.json({ message: "Register successfully" }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      console.log("masuk error di route");
      
      const formatted = error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message.toLowerCase(),
      }));

      return Response.json({ error: formatted }, { status: 400 });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 }); 
  }
}