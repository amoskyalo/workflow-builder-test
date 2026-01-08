"use client";

import { useState } from "react";
import { Formik, Form, Field } from "formik";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema } from "@/lib/validation";
import { LoginFormValues } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormError } from "@/components/ui/form-error";
import { Loader2 } from "lucide-react";

const initialValues: LoginFormValues = {
    email: "",
    password: "",
};

export function LoginForm() {
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (values: LoginFormValues) => {
        setError(null);
        try {
            await login(values);
        } catch {
            setError("Failed to login. Please try again.");
        }
    };

    return (
        <Card className="w-full max-w-xs">
            <CardHeader>
                <CardTitle className="text-xl text-center">Welcome back</CardTitle>
                <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <Formik
                initialValues={initialValues}
                validationSchema={loginSchema}
                onSubmit={handleSubmit}
                validateOnBlur={false}
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form>
                        <CardContent className="space-y-4">
                            <FormError message={error ?? undefined} />
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Field
                                    as={Input}
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    autoComplete="email"
                                />
                                <FormError message={touched.email ? errors.email : undefined} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Field
                                    as={Input}
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                />
                                <FormError message={touched.password ? errors.password : undefined} />
                            </div>
                        </CardContent>

                        <CardFooter className="mt-[24px]">
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>
                        </CardFooter>
                    </Form>
                )}
            </Formik>
        </Card>
    );
}
