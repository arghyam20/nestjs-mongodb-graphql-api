import mongoose, { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';

@Schema({ timestamps: true, versionKey: false })
export class User {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role', default: null, index: true })
    role: Types.ObjectId;

    @Prop({ type: String, default: '', index: true })
    firstName: string;

    @Prop({ type: String, default: '', index: true })
    lastName: string;

    @Prop({ type: String, default: '', index: true })
    fullName: string;

    @Prop({ type: String, default: '' })
    countryCode: string;

    @Prop({ type: String, default: '', index: true })
    phone: string;

    @Prop({ type: String, default: '', index: true })
    email: string;

    @Prop({ type: String, default: '' })
    password: string;

    @Prop({ type: String, default: '' })
    profileImage: string;

    @Prop({ type: String, default: '' })
    emailOtp: string;

    @Prop({ type: Date, default: null })
    otpExpireTime: Date;

    @Prop({ type: String, default: 'Active', enum: ['Active', 'Inactive'], index: true })
    status: string;

    @Prop({ default: false, type: Boolean })
    isProfileCompleted: boolean;
    
    @Prop({ default: false, type: Boolean })
    isAccountVerified: boolean;

    @Prop({ type: Boolean, default: false, index: true })
    isDeleted: boolean;
}

export type UserDocument = mongoose.HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: any) {
    const user = this as UserDocument;
    if (!user.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
    next();
});