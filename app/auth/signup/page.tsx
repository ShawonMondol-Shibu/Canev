"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { User, Mail, Image as ImageIcon, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group"
import { authClient } from "@/lib/auth-client"

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  image: z.instanceof(File).optional().or(z.undefined()),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type SignupFormData = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      image: undefined,
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: SignupFormData) {
    setError(null)
    setLoading(true)

    let imageBase64: string | undefined
    if (data.image) {
      imageBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(data.image!)
      })
    }

    const { error: signupError } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      image: imageBase64,
      callbackURL: "/dashboard",
    })

    if (signupError) {
      setError(signupError.message ?? signupError.statusText ?? "Something went wrong")
      setLoading(false)
      return
    }

    router.push("/dashboard")
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setValue("image", file)
      const reader = new FileReader()
      reader.onload = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-[#dfe0df]/20 backdrop-blur shadow-xl ring-1 ring-white/20">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Create account</CardTitle>
            <CardDescription>Sign up to get started with your account</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field data-invalid={!!errors.name || undefined}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <User />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      {...register("name")}
                      aria-invalid={!!errors.name || undefined}
                    />
                  </InputGroup>
                  <FieldError errors={[errors.name]} />
                </FieldContent>
              </Field>

              <Field data-invalid={!!errors.email || undefined}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <Mail />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="email"
                      type="email"
                      placeholder="hello@example.com"
                      {...register("email")}
                      aria-invalid={!!errors.email || undefined}
                    />
                  </InputGroup>
                  <FieldError errors={[errors.email]} />
                </FieldContent>
              </Field>

              <Field data-invalid={!!errors.image || undefined}>
                <FieldLabel htmlFor="image">Profile picture</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <ImageIcon />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      aria-invalid={!!errors.image || undefined}
                    />
                  </InputGroup>
                  {imagePreview && (
                    <div className="mt-2 flex justify-center">
                      <Image src={imagePreview} alt="Profile picture preview" height={100} width={100} className="size-16 rounded-full object-cover" />
                    </div>
                  )}
                  <FieldError errors={[errors.image]} />
                </FieldContent>
              </Field>

              <Field data-invalid={!!errors.password || undefined}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <Lock />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password")}
                      aria-invalid={!!errors.password || undefined}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldError errors={[errors.password]} />
                </FieldContent>
              </Field>

              <Field data-invalid={!!errors.confirmPassword || undefined}>
                <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <Lock />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("confirmPassword")}
                      aria-invalid={!!errors.confirmPassword || undefined}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldError errors={[errors.confirmPassword]} />
                </FieldContent>
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            {error && (
              <div className="w-full rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              {loading ? "Creating account..." : "Create account"}
            </Button>
            <div className="relative flex items-center gap-3 self-stretch">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">OR</span>
              <Separator className="flex-1" />
            </div>
            <Button type="button" variant="outline" className="w-full">
              <svg role="img" viewBox="0 0 24 24" className="size-4" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
