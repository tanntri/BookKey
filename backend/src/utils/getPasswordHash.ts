import bcrypt from "bcrypt";

export const getPasswordHash = (async (password: string) => {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
})