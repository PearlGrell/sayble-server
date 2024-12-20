import { Validate } from "../types";

export const validate = ({ email, first_name, last_name, dob }: Validate) => {
    const errors: string[] = [];

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        errors.push("Email is invalid or missing");
    }

    if (!dob || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
        errors.push("Date of birth is invalid (YYYY-MM-DD) or missing");
    }

    if (!first_name) {
        errors.push("First name is missing");
    }

    if (!last_name) {
        errors.push("Last name is missing");
    }

    return errors;
};
