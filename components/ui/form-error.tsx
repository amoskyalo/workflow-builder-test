import * as React from "react";
import { cn } from "@/lib/utils";

interface FormErrorProps extends React.ComponentProps<"p"> {
    message?: string;
}

function FormError({ message, className, ...props }: FormErrorProps) {
    if (!message) return null;

    return (
        <p data-slot="form-error" className={cn("text-xs text-destructive ml-[16px]", className)} {...props}>
            {message}
        </p>
    );
}

export { FormError };
