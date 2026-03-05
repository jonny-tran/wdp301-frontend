
import { Metadata } from "next";
import LoginForm from "./_components/loginForm";

export const metadata: Metadata = {
    title: "Login | VFC Portal",
    description: "Sign in to access the VFC Franchise Management System.",
};

export default function LoginPage() {
    return (
        <LoginForm />
    );
}