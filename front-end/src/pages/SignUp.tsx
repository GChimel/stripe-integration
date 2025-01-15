import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import stripe from "../assets/s.svg";
import { Input } from "../components/input";
import { AuthService } from "../services/authService";

const validation = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof validation>;

export function SignUp() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(validation),
  });

  const handleRegister = async (data: FormData) => {
    try {
      await AuthService.signUp(data);
      navigate("/sign-in", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-between">
      <div className="flex h-full w-1/2 itens-center justify-center bg-primary">
        <img src={stripe} className="object-contain w-60" />
      </div>
      <div className="flex h-full w-1/2 items-center justify-center">
        <form
          onSubmit={handleSubmit(handleRegister)}
          className="flex flex-col justify-between gap-4 shadow-lg rounded-md p-4 h-80 w-60"
        >
          <h1 className="text-2xl font-bold text-center">Sign up</h1>

          <section className="flex flex-col">
            <span className="text-sm">Name:</span>
            <Input type="text" {...register("name")} />

            <span className="text-sm">Email:</span>
            <Input type="email" {...register("email")} />

            <span className="text-sm">Password:</span>
            <Input type="password" {...register("password")} />
          </section>

          <span className="text-sm">
            Already have an account?{" "}
            <Link className="text-primary font-bold" to="/sign-in">
              Sign in
            </Link>
          </span>

          <button
            disabled={isSubmitting}
            type="submit"
            className="bg-primary text-white py-2 rounded-md hover:bg-opacity-80"
          >
            create account
          </button>
        </form>
      </div>
    </div>
  );
}
