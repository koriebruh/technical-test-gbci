import { connectDB } from "../libs/mongodb";
import User, { UserType } from "../models/user";

export type CreateUserPayload = Omit<UserType, "createdAt" | "updatedAt" | "role" | "_id"> & {
    role?: "admin" | "user";
};

export type UpdateUserPayload = Partial<CreateUserPayload>;

export const UserRepository = {
    async findAll(): Promise<UserType[]> {
        await connectDB();
        // Exclude password by default for list
        return User.find().select("-password").lean();
    },

    async findById(id: string, excludePassword = true): Promise<UserType | null> {
        await connectDB();
        const query = User.findById(id);
        if (excludePassword) {
            query.select("-password");
        }
        return query.lean();
    },

    async findByEmail(email: string): Promise<UserType | null> {
        await connectDB();
        return User.findOne({ email }).lean();
    },

    async findOne(filter: Partial<UserType>): Promise<UserType | null> {
        await connectDB();
        return User.findOne(filter).lean();
    },

    async create(payload: CreateUserPayload): Promise<UserType> {
        await connectDB();
        return User.create(payload);
    },

    async updateById(id: string, payload: UpdateUserPayload): Promise<UserType | null> {
        await connectDB();
        return User.findByIdAndUpdate(id, payload, { new: true }).select("-password").lean();
    },

    async updateOne(id: string, payload: UpdateUserPayload): Promise<void> {
        await connectDB();
        await User.updateOne({ _id: id }, payload);
    },

    async deleteById(id: string): Promise<boolean> {
        await connectDB();
        const result = await User.findByIdAndDelete(id);
        return result !== null;
    },
};