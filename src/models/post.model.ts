import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
    title: string;
    content: string;
    category: string;
    owner: mongoose.Types.ObjectId;
}

const postSchema = new Schema<IPost>(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        content: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;