import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import stripe from "../assets/s.svg";
import { Input } from "../components/input";
import { useAuth } from "../hooks/useAuth";

const validation = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof validation>;

export function SignIn() {
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(validation),
  });

  const handleSignIn = async ({ email, password }: FormData) => {
    try {
      await signIn(email, password);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-between">
      <div className="flex h-full w-1/2 itens-center justify-center bg-primary">
        <img src={stripe} className="object-contain w-60" />
      </div>
      <div className="flex h-full w-1/2 items-center justify-center">
        <form
          onSubmit={handleSubmit(handleSignIn)}
          className="flex flex-col justify-between gap-4 shadow-lg rounded-md p-4 h-60 w-60"
        >
          <h1 className="text-2xl font-bold text-center">Sign in</h1>

          <section className="flex flex-col">
            <span className="text-sm">Email:</span>
            <Input type="email" {...register("email")} />

            <span className="text-sm">Password:</span>
            <Input type="password" {...register("password")} />
          </section>

          <button
            disabled={isSubmitting}
            type="submit"
            className="bg-primary text-white py-2 rounded-md hover:bg-opacity-80"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
