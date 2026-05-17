"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Lock } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  function onSubmit(data: LoginFormData) {
    console.log(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field data-invalid={!!errors.email || undefined}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldContent>
                  <Input
                    id="email"
                    type="email"
                    placeholder="hello@example.com"
                    {...register("email")}
                    aria-invalid={!!errors.email || undefined}
                  />
                  <FieldError errors={[errors.email]} />
                </FieldContent>
              </Field>
              <Field data-invalid={!!errors.password || undefined}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <FieldContent>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    aria-invalid={!!errors.password || undefined}
                  />
                  <FieldError errors={[errors.password]} />
                </FieldContent>
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Button type="submit" className="w-full">
              <Lock data-icon="inline-start" />
              Sign in
            </Button>
            <Button variant="link" size="sm" className="w-full">
              Forgot password?
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
