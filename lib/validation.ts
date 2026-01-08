import * as Yup from "yup";

export const loginSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export const signupSchema = Yup.object({
    name: Yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm your password"),
});

export const workflowSchema = Yup.object({
    name: Yup.string()
        .min(1, "Name is required")
        .max(100, "Name must be less than 100 characters")
        .required("Workflow name is required"),
    description: Yup.string().max(500, "Description must be less than 500 characters"),
});
